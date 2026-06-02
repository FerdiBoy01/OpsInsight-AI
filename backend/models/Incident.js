const mongoose = require("mongoose");

const IncidentSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  type: { type: String, required: true },
  detail: { type: String, required: true },
  zone: { type: String, default: "Zone A" },
  status: { type: String, enum: ["active", "resolved"], default: "active" },
  image_b64: { type: String, default: "" }, // Buat nampung foto bukti dari AI
});

// 🔥 OPTIMASI DATABASE: Bikin narik history di frontend 10x lebih cepat!
IncidentSchema.index({ timestamp: -1 });

module.exports = mongoose.model("Incident", IncidentSchema);
