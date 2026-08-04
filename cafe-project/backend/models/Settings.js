const mongoose = require("mongoose");

const localizedText = {
  tr: { type: String, default: "" },
  en: { type: String, default: "" },
  ar: { type: String, default: "" },
};

// Tek bir kayittan olusan (singleton) genel site ayarlari
const settingsSchema = new mongoose.Schema(
  {
    cafeName: { type: String, default: "Cafe" },
    aboutText: localizedText,
    workingHoursText: localizedText, // Ornek: "Hergun 08:00 - 23:00"
    googleMapsUrl: { type: String, default: "" }, // Konum linki (tiklaninca haritaya yonlendirir)
    phone: { type: String, default: "" }, // tel: linki icin, ornek: +905551234567
    address: localizedText,
    instagramUrl: { type: String, default: "" },
    onlineOrderUrl: { type: String, default: "" }, // Trendyol / Getir vb.
    onlineOrderLabel: { type: String, default: "Online Sipariş" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
