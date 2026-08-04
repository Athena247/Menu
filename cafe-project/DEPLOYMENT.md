# Adım Adım Kurulum ve Yayına Alma (Deployment) Rehberi

Bu rehber dört ana bölümden oluşur:
1. Gerekli üçüncü parti hesapların açılması (MongoDB Atlas, Cloudinary)
2. Projeyi yerelde (local) çalıştırma
3. Backend'i Render'a deploy etme
4. Frontend'i Vercel'e deploy etme

---

## 1. Üçüncü Parti Hesapların Hazırlanması

### 1.1 MongoDB Atlas (Veritabanı)

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register) adresinden ücretsiz hesap açın.
2. "Build a Database" → **M0 Free** planını seçip bir cluster oluşturun.
3. **Database Access** menüsünden bir kullanıcı adı/şifre oluşturun (bu bilgiler `MONGO_URI` içinde kullanılacak).
4. **Network Access** menüsünden `Allow access from anywhere` (0.0.0.0/0) ekleyin — Render'ın sunucuları sabit IP kullanmadığı için bu gereklidir.
5. Cluster'a tıklayıp **Connect → Drivers** yolunu izleyerek bağlantı dizesini (connection string) kopyalayın. Şuna benzer olacaktır:
   ```
   mongodb+srv://kullanici:sifre@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Sonuna veritabanı adını ekleyin, örn: `.../kafe-db?retryWrites=true&w=majority`

### 1.2 Cloudinary (Görsel Depolama)

1. [cloudinary.com](https://cloudinary.com/users/register/free) adresinden ücretsiz hesap açın.
2. Dashboard'da göreceğiniz **Cloud Name**, **API Key** ve **API Secret** bilgilerini not edin. Bu üç bilgi backend `.env` dosyasında kullanılacak.

---

## 2. Projeyi Yerelde Çalıştırma

### 2.1 Backend

```bash
cd backend
npm install
cp .env.example .env
```

`.env` dosyasını açıp doldurun:

```
MONGO_URI=mongodb+srv://...          # Adım 1.1'de aldığınız bağlantı dizesi
JWT_SECRET=uzun-ve-rastgele-bir-metin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=guclu-bir-sifre
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLIENT_URL=http://localhost:3000
```

İlk admin kullanıcısını ve varsayılan site ayarlarını oluşturun:

```bash
npm run seed:admin
```

Sunucuyu başlatın:

```bash
npm run dev
```

API artık `http://localhost:5000` adresinde çalışıyor. Test için tarayıcıda
`http://localhost:5000/api/health` adresini açabilirsiniz.

### 2.2 Frontend

Yeni bir terminal açın:

```bash
cd frontend
npm install
cp .env.local.example .env.local
```

`.env.local` içeriği (yerelde backend'e işaret eder):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

- Site: `http://localhost:3000/tr`
- Admin panel: `http://localhost:3000/admin/login` (kullanıcı adı/şifre: `.env` dosyasında belirlediğiniz bilgiler)

**Önerilen ilk adımlar:** Admin panelinden önce birkaç **kategori** ekleyin (örn. Sıcak İçecekler,
Soğuk İçecekler, Tatlılar), ardından bu kategorilere **ürün** ekleyin. Son olarak
**Site Ayarları** sayfasından çalışma saatleri, telefon, Google Maps linki, Instagram
ve online sipariş linkini girin.

---

## 3. Backend'i Render'a Deploy Etme

1. Projeyi bir GitHub reposuna yükleyin (backend ve frontend aynı repoda iki ayrı klasör
   olarak durabilir, aşağıda "Root Directory" ile bunu Render'a belirteceğiz).
2. [render.com](https://render.com) hesabınızla giriş yapın → **New +** → **Web Service**.
3. GitHub reponuzu seçin.
4. Ayarlar:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (veya ihtiyacınıza göre)
5. **Environment** sekmesinden `.env` dosyanızdaki tüm değişkenleri tek tek ekleyin
   (`MONGO_URI`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL`,
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NODE_ENV=production`).
   - `CLIENT_URL` alanına şimdilik geçici bir değer girin (örn. `http://localhost:3000`);
     Adım 4'te Vercel adresinizi aldıktan sonra buraya geri dönüp güncelleyeceksiniz.
6. **Create Web Service** ile deploy'u başlatın. Deploy tamamlanınca size
   `https://kafe-backend.onrender.com` gibi bir adres verilecek — bu adresi not edin.
7. Render'ın "Shell" sekmesini açıp bir kereliğine şu komutu çalıştırarak ilk admin
   kullanıcısını canlı veritabanında oluşturun:
   ```bash
   npm run seed:admin
   ```
   (Alternatif olarak bu komutu, `MONGO_URI`'nizi kullanarak yerel makinenizden de çalıştırabilirsiniz.)

> **Not:** Render'ın ücretsiz planında servis belirli bir süre istek almazsa "uyur" ve
> ilk istekte uyanması birkaç saniye sürebilir. Kafe için düşük trafikte bu genelde
> sorun teşkil etmez; yoğun trafik bekliyorsanız ücretli bir plana geçebilirsiniz.

---

## 4. Frontend'i Vercel'e Deploy Etme

1. [vercel.com](https://vercel.com) hesabınızla giriş yapın → **Add New → Project**.
2. Aynı GitHub reponuzu seçin.
3. Ayarlar:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (otomatik algılanır)
4. **Environment Variables** kısmına ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://kafe-backend.onrender.com/api
   ```
   (Adım 3.6'da aldığınız Render adresinin sonuna `/api` ekleyin.)
5. **Deploy** butonuna basın. Birkaç dakika içinde size
   `https://kafe-siteniz.vercel.app` gibi bir adres verilecek.

### 4.1 CORS Bağlantısını Tamamlama

Render'daki backend servisinize geri dönün → **Environment** sekmesi →
`CLIENT_URL` değişkenini Vercel'den aldığınız gerçek adresle güncelleyin:

```
CLIENT_URL=https://kafe-siteniz.vercel.app
```

Kaydettikten sonra Render servisinizi yeniden başlatın (Manual Deploy / Restart).
Bu adım olmadan tarayıcı, güvenlik nedeniyle (CORS) frontend'in backend'e
istek atmasını engeller.

### 4.2 Özel Alan Adı (Opsiyonel)

Kendi alan adınızı (örn. `kafeadresi.com`) kullanmak isterseniz:
- Vercel projesinde **Settings → Domains** üzerinden alan adınızı ekleyin ve
  DNS kayıtlarını alan adı sağlayıcınızda güncelleyin.
- Alan adını bağladıktan sonra Render'daki `CLIENT_URL` değişkenini de yeni
  alan adınızla güncellemeyi unutmayın.

---

## 5. Yayın Sonrası Kontrol Listesi

- [ ] `https://<backend-adresiniz>/api/health` → `{"status":"ok"}` dönüyor mu?
- [ ] `https://<site-adresiniz>/tr`, `/en`, `/ar` sayfaları açılıyor mu, dil değiştirme çalışıyor mu?
- [ ] Admin panelinde (`/admin/login`) giriş yapılabiliyor mu?
- [ ] Admin panelinden eklenen kategori/ürün siteye yansıyor mu? (Site verileri 60 saniyede
      bir otomatik yenilenir; hemen görmek isterseniz Vercel'de "Redeploy" yapabilir ya da
      sayfayı birkaç kez yenileyebilirsiniz.)
- [ ] Footer'daki çalışma saatleri linki Google Maps'i açıyor mu?
- [ ] Footer'daki telefon linki mobilde arama ekranını açıyor mu?
- [ ] Instagram ve online sipariş linkleri yeni sekmede açılıyor mu?

## Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|---|---|
| Site açılıyor ama menü boş görünüyor | `NEXT_PUBLIC_API_URL` doğru mu kontrol edin; backend'in `/api/health` adresine erişilebildiğinden emin olun. |
| Admin girişi "CORS" hatası veriyor | Render'daki `CLIENT_URL` değerinin Vercel adresinizle birebir aynı (https:// dahil, sonda / olmadan) olduğundan emin olun. |
| Resim yükleme başarısız oluyor | Cloudinary bilgilerinin (`CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`) doğru girildiğinden emin olun. |
| "Admin bulunamadı" / giriş yapamıyorum | `npm run seed:admin` komutunu canlı ortamda (Render Shell) çalıştırdığınızdan emin olun. |
