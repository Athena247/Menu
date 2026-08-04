const express = require("express");
const Settings = require("../models/Settings");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Tek bir settings dokumani olusturur/getirir (singleton)
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

// @route   GET /api/settings
// @desc    Site ayarlarini getir (herkese acik - footer, iletisim vs. icin)
router.get("/", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

// @route   PUT /api/settings
// @desc    Site ayarlarini guncelle (admin)
router.put("/", protect, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: "Ayarlar guncellenemedi", error: error.message });
  }
});

module.exports = router;
