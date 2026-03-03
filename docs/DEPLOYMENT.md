# Hosting Winlytics (GitHub → Vercel + Render)

Deploy the frontend on **Vercel** and the backend on **Render** using your GitHub repo.

---

## 1. Deploy backend (Render)

1. Go to [render.com](https://render.com) and sign up (or log in with GitHub).
2. **New** → **Web Service**.
3. Connect your GitHub account if needed, then select the **Winlytics** repo.
4. Configure:
   - **Name:** `winlytics-api` (or any name).
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Under **Environment** (Environment Variables), add:
   - `SECRET_KEY` — random string (e.g. from `openssl rand -hex 32`).
   - `CORS_ORIGINS` — your Vercel frontend URL, e.g. `https://winlytics.vercel.app` (you can add this after the frontend is deployed; add the URL Render gives you first if you want to test the API).
   - Optional: `GOOGLE_CLIENT_ID` if you use Google Sign-In.
   - Optional: `DATABASE_URL` if you add a PostgreSQL database (Render has free Postgres; for MVP, Render’s disk is enough for SQLite).
6. Click **Create Web Service**. Wait for the first deploy to finish.
7. Copy the service URL, e.g. `https://winlytics-api.onrender.com`.

---

## 2. Deploy frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up (or log in with GitHub).
2. **Add New** → **Project** → import the **Winlytics** repo.
3. Configure:
   - **Root Directory:** `frontend` (click **Edit** and set it).
   - **Framework Preset:** Next.js (auto-detected).
   - **Build Command:** `npm run build` (default).
   - **Output Directory:** (leave default).
4. Under **Environment Variables**, add:
   - **Name:** `NEXT_PUBLIC_API_URL`  
   - **Value:** your Render backend URL, e.g. `https://winlytics-api.onrender.com`  
   - Apply to Production (and Preview if you want).
5. Optional: `NEXT_PUBLIC_GOOGLE_CLIENT_ID` if you use Google Sign-In.
6. Click **Deploy**. Wait for the build to finish.
7. Copy your frontend URL, e.g. `https://winlytics.vercel.app`.

---

## 3. Allow frontend origin in backend (CORS)

1. In **Render** → your **winlytics-api** service → **Environment**.
2. Set or update **CORS_ORIGINS** to your **exact** Vercel URL, e.g.:
   - `https://winlytics.vercel.app`
   - Or with a custom domain: `https://www.yourdomain.com`
   - Multiple origins: `https://winlytics.vercel.app,https://www.yourdomain.com` (comma-separated, no spaces).
3. Save. Render will redeploy; wait for it to finish.

---

## 4. Test the live app

1. Open the Vercel URL (e.g. `https://winlytics.vercel.app`).
2. Sign up with email/password (or Google if configured).
3. Use Dashboard and Applications Tracker; they should call the Render API.

---

## Optional: PostgreSQL on Render

- In Render: **New** → **PostgreSQL**. Create a DB and copy the **Internal Database URL** (or External if your backend is elsewhere).
- In your **backend** service env, set `DATABASE_URL` to that URL.
- For SQLAlchemy async use: `postgresql+asyncpg://user:pass@host/dbname`. Add `asyncpg` to `requirements.txt` and use the same URL format Render gives you (swap `postgresql://` for `postgresql+asyncpg://`).
- Redeploy the backend after setting `DATABASE_URL`.

---

## Summary

| Part      | Where   | URL / Env |
|----------|---------|-----------|
| Repo     | GitHub  | `https://github.com/nitinshivakumar/Winlytics` |
| Frontend | Vercel  | Root: `frontend`, env: `NEXT_PUBLIC_API_URL=<Render URL>` |
| Backend  | Render  | Root: `backend`, Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`, env: `SECRET_KEY`, `CORS_ORIGINS=<Vercel URL>` |

After deployment, commit and push to GitHub; Vercel and Render will redeploy automatically if auto-deploy is on.
