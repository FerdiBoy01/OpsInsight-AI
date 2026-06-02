// backend/server.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const fsSync = require("fs");
const path = require("path");
const sharp = require("sharp");
const cameraRoutes = require("./routes/cameraRoutes");
const Camera = require("./models/Camera");
require("dotenv").config();

// ==========================================
// 🚀 INISIALISASI EXPRESS & SERVER
// ==========================================
const app = express();
const server = http.createServer(app);

// 🔥 PORT DINAMIS (Wajib buat Azure)
const PORT = process.env.PORT || 8080;

// 🔥 OPTIMASI SOCKET.IO (Anti Putus/DC di Azure)
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// LIMIT DITAMBAH JADI 50mb JAGA-JAGA AI NGIRIM GAMBAR MENTAH GEDE
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==========================================
// 📂 MANAJEMEN PENYIMPANAN FOTO BUKTI
// ==========================================
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fsSync.existsSync(uploadDir)) {
  fsSync.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ==========================================
// 🛠️ KONEKSI MONGODB (AUTO-RECONNECT MODE)
// ==========================================
// 🔥 Opsi jadul (useNewUrlParser & useUnifiedTopology) udah dihapus biar gak bentrok di Mongoose versi baru
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    autoIndex: true,
  })
  .then(() => console.log("🔥 [DATABASE] MongoDB Cloud Connected!"))
  .catch((err) => console.log("❌ [DATABASE] Gagal konek:", err));

mongoose.connection.on("error", (err) => {
  console.error("⚠️ [DATABASE] Koneksi terganggu (Auto-reconnecting...):", err);
});

// Skema Incident
const incidentSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  type: String,
  detail: String,
  worker_status: String,
  zone: { type: String, default: "Area Tidak Diketahui", index: true },
  image_url: { type: String, default: "" },
});

// 🔥 Indexing agar penarikan data History 300x lebih cepat
incidentSchema.index({ timestamp: -1 });
const Incident = mongoose.model("Incident", incidentSchema);

// Daftarin Routes Kamera
app.use("/", cameraRoutes);

// ==========================================
// 🧠 MEMORI ANTI-SPAM (DEDUPLICATION) & STATE AI
// ==========================================
let isAiActive = true;
const lastAlertCache = {};
const COOLDOWN_MS = 10000; // 10 DETIK COOLDOWN (Jangan spam DB)

app.get("/api/config", (req, res) => {
  res.json({ ai_active: isAiActive });
});

app.post("/api/config/toggle-ai", (req, res) => {
  isAiActive = !isAiActive;
  console.log(
    `\n⚙️ [SYSTEM COMMAND] Mode AI diubah menjadi: ${isAiActive ? "ON (Mendeteksi)" : "OFF (Normal CCTV)"}`,
  );
  io.emit("config_update", { ai_active: isAiActive }); // Beri tau React!
  res.json({ ai_active: isAiActive });
});

// ==========================================
// 🚨 ENDPOINT PENERIMA SENSOR DARI PYTHON (AI)
// ==========================================
app.post("/api/alerts", async (req, res) => {
  const alertData = req.body;
  let finalImageUrl = "";

  try {
    // 1. Ambil nama kamera aktif untuk dijadikan kunci Anti-Spam
    const kameraAktif = await Camera.findOne({ isActive: true }).lean();
    const namaLokasi = kameraAktif ? kameraAktif.name : "Area Tidak Diketahui";

    // 2. FILTERING LOG AMAN (Tanpa Simpan Gambar, Irit Storage)
    if (alertData.detail.includes("Compliant") || alertData.detail === "Idle") {
      const newIncident = new Incident({
        type: alertData.type || "safety_compliant",
        detail: alertData.detail,
        worker_status: alertData.worker_status || "active",
        timestamp: alertData.timestamp
          ? alertData.timestamp * 1000
          : Date.now(),
        image_url: "",
        zone: namaLokasi,
      });
      const savedIncident = await newIncident.save();
      io.emit("new_safety_alert", savedIncident);
      return res
        .status(200)
        .json({ message: "Log Aman (Sesuai SOP) diterima tanpa gambar." });
    }

    // 3. DEDUPLICATE (ANTI-SPAM EVENT SAMA DI LOKASI SAMA DALAM 10 DETIK)
    const cacheKey = `${namaLokasi}_${alertData.detail}`;
    const now = Date.now();

    if (
      lastAlertCache[cacheKey] &&
      now - lastAlertCache[cacheKey] < COOLDOWN_MS
    ) {
      return res
        .status(200)
        .json({ message: "Spam dicegah oleh sistem. (Sedang masa Cooldown)" });
    }
    lastAlertCache[cacheKey] = now;

    // 4. COMPRESS IMAGE DENGAN SHARP (WAJIB)
    if (alertData.image_b64) {
      try {
        const fileName = `incident_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`;
        const filePath = path.join(uploadDir, fileName);

        // Bersihkan prefix Base64 jika Python mengirimkannya
        const base64Data = alertData.image_b64.replace(
          /^data:image\/\w+;base64,/,
          "",
        );
        const imgBuffer = Buffer.from(base64Data, "base64");

        await sharp(imgBuffer)
          .resize({ width: 640 }) // Perkecil resolusi (Sangat Hemat Storage Azure)
          .jpeg({ quality: 65 }) // Kompres kualitas
          .toFile(filePath);

        // Path Relative agar aman saat diakses dari Azure
        finalImageUrl = `/uploads/${fileName}`;
        console.log(
          `🗜️ [COMPRESS] Gambar dikecilkan dan disimpan: ${fileName}`,
        );
      } catch (error) {
        console.error(
          "❌ [SHARP ERROR] Gagal mengkompres/menyimpan foto:",
          error,
        );
      }
    }

    // 5. SIMPAN PELANGGARAN KE DATABASE
    const newIncident = new Incident({
      type: alertData.type || "safety_violation",
      detail: alertData.detail,
      worker_status: alertData.worker_status || "active",
      timestamp: alertData.timestamp ? alertData.timestamp * 1000 : Date.now(),
      image_url: finalImageUrl,
      zone: namaLokasi,
    });

    const savedIncident = await newIncident.save();
    console.log(
      `🚨 [DANGER ALERT] ${alertData.detail} | LOKASI: ${namaLokasi}`,
    );

    // Siarkan ke seluruh user yang lagi buka Dashboard (Real-time!)
    io.emit("new_safety_alert", savedIncident);
    res.status(200).json({ message: "Payload diterima & Insiden dicatat" });
  } catch (err) {
    console.error("❌ [DB ERROR] Gagal simpan ke MongoDB:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==========================================
// 📈 ENDPOINT AMBIL DATA HISTORY
// ==========================================
app.get("/api/incidents", async (req, res) => {
  try {
    const history = await Incident.find()
      .sort({ timestamp: -1 })
      .limit(300) // Dibatasi 300 agar API cepat dan Dashboard nggak ngelag
      .lean();

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 PING ENDPOINT BIAR AZURE GAK TIDUR (COLD START)
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Mesin OpsInsight Menyala!" });
});

// ==========================================
// 🛡️ GLOBAL ERROR HANDLER (SERVER GAK BOLEH MATI)
// ==========================================
app.use((err, req, res, next) => {
  console.error("🔥 [CRITICAL] GLOBAL ERROR TERCEGAH:", err.stack);
  res.status(500).send("Terjadi kesalahan pada sistem backend!");
});

// ==========================================
// START SERVER
// ==========================================
server.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 [AI-K3 CORE] Backend Siap pada Port ${PORT}`);
  console.log(`🛡️ [SYSTEM] Anti-Spam (10s) & Image Compression Aktif`);
  console.log(`========================================\n`);
});
