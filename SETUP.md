# GovTech - Quick Setup Guide

## ⚡ Quick Start (5 minutes)

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd govtech
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cd ..
```

**Frontend:**
```bash
npm install
```

### 4. Setup Database
```bash
# Create PostgreSQL database (with admin user)
psql -U postgres -c "CREATE DATABASE govtech_db;"

# Initialize tables
cd backend
python create_db.py
cd ..
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application
- **Frontend:** http://localhost:5366
- **Backend API:** http://127.0.0.1:8000
- **API Docs:** http://127.0.0.1:8000/docs

---

## 📝 Environment Variables

The `.env.local` file at project root contains:

```dotenv
# Frontend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Backend
DATABASE_URL=postgresql://postgres:admin@localhost:5432/govtech_db
SECRET_KEY=supersecretkey_change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PROJECT_NAME=GovTech
API_V1_STR=/api/v1
```

**⚠️ IMPORTANT:**
- Never commit `.env.local` to version control
- Change `SECRET_KEY` to a random string in production
- Use secure database passwords in production

---

## 🐛 Common Issues

### "Port already in use"
```bash
# Find and kill process on port
netstat -ano | findstr :5366
taskkill /PID <PID> /F
```

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
# Verify DATABASE_URL in .env.local
# Make sure database exists: psql -U postgres -d govtech_db
```

### "ModuleNotFoundError"
```bash
# Reinstall backend dependencies
cd backend
pip install -r requirements.txt
```

### "Tailwind styles not loading"
```bash
# Clear Next.js cache and restart
rm -rf .next
npm run dev
```

---

## 📚 Full Documentation

See [README.md](README.md) for comprehensive documentation including:
- Detailed troubleshooting guide
- API endpoints reference
- Security checklist
- Development tips
- Additional resources

---

## 🎯 Project Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 5366 | http://localhost:5366 |
| Backend (FastAPI) | 8000 | http://127.0.0.1:8000 |
| PostgreSQL | 5432 | localhost |

---

## ✅ Verification Checklist

After setup, verify:
- [ ] `.env.local` file created in project root
- [ ] Python virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] PostgreSQL database created (`govtech_db`)
- [ ] Database tables initialized (`python create_db.py`)
- [ ] Backend starts without errors (`uvicorn app.main:app --reload`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access http://localhost:5366 in browser
- [ ] Can access http://127.0.0.1:8000/docs for API documentation

---

## 🚀 Next Steps

1. **Review the full README:**
   - `cat README.md` or open in your editor

2. **Test the API:**
   - Visit http://127.0.0.1:8000/docs in your browser
   - Explore available endpoints with Swagger UI
   - Try signup and login flows

3. **Explore the Application:**
   - Visit http://localhost:5366
   - Create a test account
   - Take an assessment
   - View your profile

4. **Development:**
   - Start building features
   - Changes auto-reload in both frontend and backend
   - Check API documentation for available endpoints

---

**For detailed documentation, see [README.md](README.md)**

*Last Updated: February 2026*
