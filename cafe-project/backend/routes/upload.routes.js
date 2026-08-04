const express = require("express");
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   POST /api/upload
// @desc    Tek bir resim yukler ve Cloudinary URL'ini doner (admin)
router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Resim dosyasi bulunamadi" });
  }
  res.json({
    url: req.file.path,
    publicId: req.file.filename,
  });
});

module.exports = router;
