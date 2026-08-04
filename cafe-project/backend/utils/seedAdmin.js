// Bu script .env dosyasindaki bilgilerle ilk admin kullanicisini olusturur.
// Calistirmak icin: npm run seed:admin
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Settings = require("../models/Settings");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB'ye baglanildi");

    const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) {
      console.log(`"${process.env.ADMIN_USERNAME}" kullanicisi zaten mevcut. Islem atlandi.`);
    } else {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || "admin",
        password: process.env.ADMIN_PASSWORD || "changeme123",
        email: process.env.ADMIN_EMAIL || "",
      });
      console.log(`Admin kullanicisi olusturuldu: ${process.env.ADMIN_USERNAME}`);
    }

    const settingsExists = await Settings.findOne();
    if (!settingsExists) {
      await Settings.create({
        cafeName: "Kafe",
        aboutText: {
          tr: "Modern ve sicak bir ortamda ozenle hazirlanan kahveler.",
          en: "Carefully crafted coffee in a modern, warm setting.",
          ar: "قهوة معدة بعناية في أجواء عصرية ودافئة.",
        },
        workingHoursText: {
          tr: "Her gun 08:00 - 23:00",
          en: "Daily 08:00 - 23:00",
          ar: "يوميًا 08:00 - 23:00",
        },
        phone: "+905551234567",
        googleMapsUrl: "https://maps.google.com",
        instagramUrl: "https://instagram.com",
        onlineOrderUrl: "",
        onlineOrderLabel: "Online Siparis",
      });
      console.log("Varsayilan site ayarlari olusturuldu. Admin panelinden duzenleyebilirsiniz.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Hata:", error.message);
    process.exit(1);
  }
})();
