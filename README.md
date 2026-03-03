# Winlytics

Data-driven career tracking platform — navigate your job search and maximize your chances of landing an offer.

## Run locally

You need **Python 3.10+** and **Node.js 18+** (with npm) on your machine.

### 1. Backend (FastAPI)

```bash
cd winlytics/backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API: http://127.0.0.1:8000  
Docs: http://127.0.0.1:8000/docs  

### 2. Frontend (Next.js)

In a **second terminal**:

```bash
cd winlytics/frontend
npm install
npm run dev
```

App: http://localhost:3000  

### 3. Use the app

1. Open http://localhost:3000  
2. Sign up (or log in)  
3. You’re redirected to the Dashboard  
4. Use **Applications Tracker** to add, edit, delete applications and update status (Applied → Interview → Offer → Rejected)  
5. Other modules (Interviews, Offers, Activity, Analytics, etc.) are placeholders for Phase 2/3  

## Project layout

- `backend/` — FastAPI app (auth, PostgreSQL-ready models, Applications CRUD, dashboard stats)
- `frontend/` — Next.js app (landing, login/signup, dashboard, sidebar, applications tracker)

## Tech stack

- **Backend:** FastAPI, SQLAlchemy (SQLite by default; set `DATABASE_URL` for PostgreSQL), JWT, bcrypt  
- **Frontend:** Next.js 14, React, Tailwind CSS  

## Env (optional)

- **Backend** `backend/.env`: `SECRET_KEY`, `DATABASE_URL` (e.g. `postgresql+asyncpg://...`)  
- **Frontend** `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` (default)  

## Hosting (later)

- Frontend: Vercel (connect GitHub repo)  
- Backend: Render / Railway  
- DB: Supabase / Neon  
