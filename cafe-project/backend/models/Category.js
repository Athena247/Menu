const mongoose = require("mongoose");

// Coklu dil destegi icin her metin alani {tr, en, ar} seklinde tutulur
const localizedString = {
  tr: { type: String, required: true, trim: true },
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const categorySchema = new mongoose.Schema(
  {
    name: localizedString,
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
