require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const settingsRoutes = require("./routes/settings.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
app.set('trust proxy', 1);

// Veritabani baglantisi
connectDB();

// Guvenlik middleware'leri
app.use(helmet());
app.use(express.json({ limit: "2mb" }));

// CORS: sadece izin verilen frontend adreslerinden istek kabul edilir
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman gibi origin gondermeyen istekler icin origin undefined olabilir
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS politikasi tarafindan engellendi"));
    },
    credentials: true,
  })
);

// Basit rate limiting (ozellikle login endpoint'i icin brute-force korumasi)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 30,
  message: { message: "Cok fazla istek gonderildi, lutfen daha sonra tekrar deneyin." },
});
app.use("/api/auth/login", authLimiter);

// Route'lar
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);

// Saglik kontrolu (Render icin)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("Cafe API calisiyor. Endpoint listesi icin /api/health adresini kontrol edin.");
});

// 404 yakalayici
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint bulunamadi" });
});

// Genel hata yakalayici
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Sunucu hatasi" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda calisiyor (${process.env.NODE_ENV || "development"})`);
});
