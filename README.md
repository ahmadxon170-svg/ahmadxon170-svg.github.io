# AHMAD ML META

GitHub Pages + tashqi backend deploy bo'yicha to'liq yo'riqnoma: `README-GITHUB-PAGES.md`.

# AHMAD ML META

Full-stack starter: React + Vite frontend, Express API backend, Supabase/PostgreSQL database.

## Requirements
- Node.js 20+
- Supabase project (free tier is enough to start)
- npm

## 1. Database
1. Create a Supabase project.
2. Open SQL Editor and run `database/schema.sql`.
3. Copy Project URL and Service Role Key from Project Settings → API.

## 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
Fill `.env` with `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a long `ADMIN_PASSWORD`.
The API starts at http://localhost:4000.

Create the first admin password in `.env`. The backend login endpoint uses that password.
For production, set strong unique secrets and deploy the API on Render, Railway, or another Node host.
Never put the Supabase service-role key in frontend code.

## 3. Frontend
In a second terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Set `VITE_API_URL=http://localhost:4000/api`.
Open the URL printed by Vite (usually http://localhost:5173).

## Admin
Open `/admin`, sign in using `ADMIN_PASSWORD`, then add/update heroes, patch metadata, and combo recommendations.
This starter deliberately does not invent live win/pick/ban statistics. Update stats from a trusted source in the admin panel.

## Deployment
- Frontend: Vercel or Netlify; set `VITE_API_URL` to your deployed API URL.
- Backend: Render/Railway; configure all backend environment variables.
- Database: Supabase.
- Configure CORS using `FRONTEND_ORIGIN` to your deployed frontend URL.

## Notes
- Hero portrait URLs can be pasted into admin. Use only images you have permission to use.
- Meta data is manually curated by an admin every 2–3 months, with patch/version and last-updated date displayed publicly.
- Add rate limiting, HTTPS, backups, and a stronger user-management flow before high-traffic production use.
