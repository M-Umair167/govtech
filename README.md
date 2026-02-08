# BrainBit

## "Deep Tech" Testing Center

### Tech Stack
- **Frontend**: Next.js, Tailwind CSS, Zod, React Query.
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL.
- **Database**: Local Postgres (Switchable to Supabase).

### Structure
- `frontend/`: Next.js Web App.
- `backend/`: FastAPI API.
- `spec/`: Technical constraints and documentation.

### Getting Started

#### Backend
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Documentation
- [Auth Flow](spec/auth_flow.md)
- [Theme Logic](spec/theme_logic.md)
