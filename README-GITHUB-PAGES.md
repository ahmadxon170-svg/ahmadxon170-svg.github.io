# AHMAD ML META — GitHub Pages + tashqi backend

Bu variantda frontend GitHub Pages'da, API esa Render/Railway kabi Node.js hostingda,
ma'lumotlar bazasi Supabase'da ishlaydi.

## Arxitektura
- Frontend: React + Vite → GitHub Pages
- Backend: Express API → Render yoki Railway
- Database: Supabase PostgreSQL
- Admin: `https://ahmadxon170-svg.github.io/admin.html`

## 1. Supabase
1. Supabase'da yangi project yarating.
2. SQL Editor'da `database/schema.sql` ni ishga tushiring.
3. Project URL va `service_role` secret key'ni oling. Bu kalit faqat backend `.env` da turadi.

## 2. Backendni Render'ga joylash
1. GitHub'da ushbu loyihani yangi repository'ga yuklang (yoki mavjud repository'ga fayllarni joylang).
2. Render'da New → Web Service tanlab repository'ni ulang.
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment variables kiriting:
   - `SUPABASE_URL` = Supabase Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase service_role key
   - `ADMIN_PASSWORD` = uzun va taxmin qilib bo'lmaydigan parol
   - `JWT_SECRET` = uzun tasodifiy maxfiy qiymat
   - `FRONTEND_ORIGIN` = `https://ahmadxon170-svg.github.io`
7. Deploy tugagach API manzilini, masalan `https://your-api.onrender.com`, yozib oling.

## 3. Frontendni GitHub Pages'ga joylash
1. GitHub repository Settings → Pages bo'limiga o'ting.
2. Build and deployment → Source: **GitHub Actions** ni tanlang.
3. Repository Settings → Secrets and variables → Actions → Variables → New repository variable.
4. Variable nomi: `VITE_API_URL`
5. Qiymati: `https://your-api.onrender.com/api` (o'zingizning backend URL'ingiz bilan).
6. Loyihaning barcha fayllarini repository'ning root qismiga yuklang.
7. `main` branch'ga push qiling. Actions workflow avtomatik build va deploy qiladi.

## 4. Admin va yangilash
- Sayt: `https://ahmadxon170-svg.github.io/`
- Admin: `https://ahmadxon170-svg.github.io/admin.html`
- Admin paroli backend'dagi `ADMIN_PASSWORD`.
- Har 2–3 oyda patch, tier va statistikalarni admin panel orqali yangilang.

## Xavfsizlik
- `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `JWT_SECRET` ni hech qachon frontendga yoki GitHub repository'ga joylamang.
- Faqat backend hosting environment variables ichida saqlang.
- GitHub Pages faqat statik frontendni joylaydi; API va database tashqi xizmatlarda qoladi.

## Muhim cheklovlar
- Win/pick/ban rate qiymatlari avtomatik ravishda o'yindan olinmaydi. Admin ishonchli manbadan tekshirib kiritishi kerak.
- Demo qahramonlar ro'yxati real-time meta emas; bazaga haqiqiy patch ma'lumotlari kiritilgach, API shu ma'lumotlarni ko'rsatadi.
- Ushbu starterda admin login oddiy parol + JWT orqali. Ommaviy production uchun Supabase Auth, kuchli rate limiting, audit log, backup va CSRF/CSP sozlamalarini kuchaytirish tavsiya etiladi.
