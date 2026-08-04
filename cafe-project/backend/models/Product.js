const mongoose = require("mongoose");

const localizedString = {
  tr: { type: String, required: true, trim: true },
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const localizedText = {
  tr: { type: String, default: "", trim: true },
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};

const productSchema = new mongoose.Schema(
  {
    name: localizedString,
    description: localizedText,
    price: { type: Number, required: true, min: 0 },
    // Ikinci bir para birimi / indirimli fiyat gosterimi icin opsiyonel
    currency: { type: String, default: "TRY" },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }, // Cloudinary silme islemleri icin
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
