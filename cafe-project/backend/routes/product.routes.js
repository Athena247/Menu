const express = require("express");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/products
// @desc    Tum yayinda olan urunleri listele (herkese acik). ?category=slug ile filtrelenebilir
router.get("/", async (req, res) => {
  try {
    const filter = { isAvailable: true };

    if (req.query.category) {
      const Category = require("../models/Category");
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) filter.category = cat._id;
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ order: 1, createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

// @route   GET /api/products/all
// @desc    Admin panel icin yayinda olmayanlar dahil tum urunler
router.get("/all", protect, async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name slug").sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

// @route   GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Urun bulunamadi" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

// @route   POST /api/products
// @desc    Yeni urun olustur (admin). image alani onceden /api/upload ile yuklenip URL olarak gonderilir
router.post("/", protect, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    const populated = await product.populate("category", "name slug");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: "Urun olusturulamadi", error: error.message });
  }
});

// @route   PUT /api/products/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");
    if (!product) return res.status(404).json({ message: "Urun bulunamadi" });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Urun guncellenemedi", error: error.message });
  }
});

// @route   DELETE /api/products/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Urun bulunamadi" });

    // Cloudinary'deki resmi de sil
    if (product.image && product.image.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId).catch(() => {});
    }

    await product.deleteOne();
    res.json({ message: "Urun silindi" });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatasi", error: error.message });
  }
});

module.exports = router;
