const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route   POST /api/auth/login
// @desc    Admin girisi
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Kullanici adi ve sifre zorunludur" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Kullanici adi veya sifre hatali" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Kullanici adi veya sifre hatali" });
    }

    res.json({
      token: generateToken(admin._id),
      admin: { id: admin._id, username: admin.username, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Giris yapmis adminin bilgisini dondurur (token dogrulama)
router.get("/me", protect, async (req, res) => {
  res.json({ admin: req.admin });
});

module.exports = router;
