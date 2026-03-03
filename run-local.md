# Run Winlytics locally

Do this on your machine (Node and Python installed).

## Quick start (recommended)

From the project root:

```bash
bash scripts/start-mac.sh
```

This opens **two Terminal windows** and runs backend + frontend automatically.

## 1. Backend

From the **project root** (Winlytics folder):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
./.venv/bin/uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If you see **Address already in use**, either stop the other app using port 8000 or run on another port (e.g. `--port 8001`) and set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8001` in `frontend/.env.local`.

Leave this terminal open. API: http://127.0.0.1:8000 | Docs: http://127.0.0.1:8000/docs

## 2. Frontend (new terminal)

From the **project root** again:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 — Sign up, then use Dashboard and Applications Tracker.
