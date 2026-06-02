const express = require("express");
const router = express.Router();
const Camera = require("../models/Camera");

// 1. Ambil semua data kamera
router.get("/api/cameras", async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Tanya AI: "Kamera mana yang aktif?"
router.get("/api/cameras/active", async (req, res) => {
  try {
    const activeCam = await Camera.findOne({ isActive: true });
    if (activeCam) {
      res.json(activeCam);
    } else {
      // Kalau nggak ada yang aktif, balikin kamera pertama aja (Fallback)
      const firstCam = await Camera.findOne();
      if (firstCam) {
        firstCam.isActive = true;
        await firstCam.save();
        res.json(firstCam);
      } else {
        res.status(404).json({ error: "Tidak ada kamera di database" });
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Tambah kamera baru
router.post("/api/cameras", async (req, res) => {
  try {
    const totalCameras = await Camera.countDocuments();
    const newCam = new Camera({
      name: req.body.name,
      url: req.body.url,
      isActive: totalCameras === 0,
    });
    const savedCam = await newCam.save();
    res.json(savedCam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. TOMBOL PENGGANTI KAMERA (Anti-Crash)
router.post("/api/cameras/switch/:id", async (req, res) => {
  try {
    await Camera.updateMany({}, { isActive: false });
    const updatedCam = await Camera.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true },
    );
    if (!updatedCam)
      return res.status(404).json({ error: "Kamera tidak ditemukan" });

    res.json({
      message: "Sinyal pindah kamera dikirim ke AI!",
      camera: updatedCam,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. HAPUS KAMERA
router.delete("/api/cameras/:id", async (req, res) => {
  try {
    await Camera.findByIdAndDelete(req.params.id);
    res.json({ message: "Kamera berhasil dihapus!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
