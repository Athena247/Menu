const express = require("express");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/categories
// @desc    Tum aktif kategorileri listele (herkese acik)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

// @route   GET /api/categories/all
// @desc    Admin panel icin pasif olanlar dahil tum kategoriler
router.get("/all", protect, async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

// @route   POST /api/categories
// @desc    Yeni kategori olustur (admin)
router.post("/", protect, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Kategori olusturulamadi", error: error.message });
  }
});

// @route   PUT /api/categories/:id
// @desc    Kategori guncelle (admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ message: "Kategori bulunamadi" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Kategori guncellenemedi", error: error.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Kategori sil (admin) - iliskili urun varsa engelle
router.delete("/:id", protect, async (req, res) => {
  try {
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Bu kategoriye bagli ${productCount} urun var. Once urunleri silin veya baska kategoriye tasiyin.`,
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Kategori bulunamadi" });
    res.json({ message: "Kategori silindi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

module.exports = router;
