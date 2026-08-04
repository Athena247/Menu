# Kafe Web Sitesi + Yönetim Paneli

Modern, minimalist ve çok dilli (TR / EN / AR) bir kafe web sitesi ile bu siteyi
yöneten bir admin panelinden oluşan tam-yığın (full-stack) proje.

## Klasör Yapısı

```
cafe-project/
├── backend/     → Node.js + Express + MongoDB API (Render'da barınır)
└── frontend/    → Next.js 14 (App Router) sitesi + Admin Panel (Vercel'de barınır)
```

## Teknolojiler

| Katman     | Teknoloji |
|------------|-----------|
| Frontend   | Next.js 14 (App Router), TypeScript, Tailwind CSS, next-intl |
| Backend    | Node.js, Express, JWT (jsonwebtoken), Mongoose |
| Veritabanı | MongoDB Atlas |
| Görsel Depolama | Cloudinary |
| Dağıtım    | Frontend → Vercel, Backend → Render |

## Özellikler

- 🌍 Türkçe / İngilizce / Arapça (tam RTL destekli) çok dilli site
- 🎨 Mat antrasit + krem + ince gold vurgulu, minimalist lüks tasarım
- 📋 Veritabanından dinamik çekilen kategori ve ürünler (isim, açıklama, fiyat, görsel)
- 🕒 Footer'da: haritaya yönlendiren çalışma saatleri, `tel:` linkli telefon, Instagram
  ve online sipariş (Trendyol/Getir vb.) bağlantıları — tümü yeni sekmede açılır
- 🔐 JWT ile korunan admin paneli: ürün/kategori CRUD, görsel yükleme (Cloudinary),
  site ayarlarını (hakkımızda, çalışma saatleri, iletişim) düzenleme

## Hızlı Başlangıç (Yerelde Çalıştırma)

Detaylı adımlar için **DEPLOYMENT.md** dosyasına bakın. Özet:

```bash
# 1) Backend
cd backend
cp .env.example .env      # .env dosyasını doldurun (MongoDB URI, Cloudinary, JWT_SECRET)
npm install
npm run seed:admin        # ilk admin kullanıcısını oluşturur
npm run dev                # http://localhost:5000

# 2) Frontend (yeni bir terminalde)
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                # http://localhost:3000
```

Site: `http://localhost:3000/tr` (veya `/en`, `/ar`)
Admin panel: `http://localhost:3000/admin/login`
