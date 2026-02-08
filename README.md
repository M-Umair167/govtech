# GovTech - Assessment Platform

A modern full-stack assessment platform built with Next.js and FastAPI. This project allows users to take assessments, view results, and manage their profiles.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [Development Server Details](#development-server-details)
- [APIs](#apis)
- [Project Features](#project-features)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)
- **Git** - [Download](https://git-scm.com/)
- **Virtual Environment** (Python venv or conda)

### Windows-specific Setup

If you're on Windows, you may need to install:
- Visual C++ Build Tools (for some Python packages)
- PostgreSQL installer includes pgAdmin (optional but helpful)

## 📁 Project Structure

```
govtech/
├── backend/                     # FastAPI Backend (port 8000)
│   ├── app/
│   │   ├── api/v1/endpoints/   # API route handlers
│   │   ├── models/             # Database models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── core/               # Config and security
│   │   ├── db/                 # Database session
│   │   └── repositories/       # Data access layer
│   ├── requirements.txt        # Python dependencies
│   └── main.py                 # FastAPI app entry point
│
├── src/                         # Next.js Frontend (port 5366)
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   └── services/               # API services
│
├── .env.local                   # Unified environment variables (gitignored)
├── .env.example                # Example environment file (template)
├── README.md                    # This file
├── package.json                # Node.js dependencies
└── tailwind.config.ts          # Tailwind CSS configuration
```

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd govtech
```

### Step 2: Environment Configuration

#### Copy the .env.example to .env.local

```bash
# Copy the example environment file
cp .env.example .env.local

# Or on Windows:
copy .env.example .env.local
```

#### Edit `.env.local` with your settings

```dotenv
# Frontend
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Backend
DATABASE_URL=postgresql://postgres:admin@localhost:5432/govtech_db
SECRET_KEY=your-secret-key-here  # Change this in production!
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
PROJECT_NAME=GovTech
API_V1_STR=/api/v1
```

**⚠️ Important Security Notes:**
- **Never commit `.env.local` to version control** - it contains sensitive information
- The `.env.local` file is already listed in `.gitignore` for security
- For production, use strong, randomly generated `SECRET_KEY`
- Generate a secure key with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

### Step 3: Database Setup

#### 1. Create PostgreSQL Database

```bash
# Using psql (PostgreSQL command-line)
psql -U postgres

# In the psql prompt:
CREATE DATABASE govtech_db;
CREATE USER govtech_user WITH PASSWORD 'govtech_password';
ALTER ROLE govtech_user SET client_encoding TO 'utf8';
ALTER ROLE govtech_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE govtech_user SET default_transaction_deferrable TO on;
ALTER ROLE govtech_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE govtech_db TO govtech_user;
\q
```

Or update `DATABASE_URL` in `.env.local` to match your existing PostgreSQL setup.

#### 2. Backend Database Initialization

```bash
cd backend
python create_db.py
```

This script will create all necessary tables defined in your models.

### Step 4: Backend Setup

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 5: Frontend Setup

```bash
# Return to project root
cd ../

# Install Node.js dependencies
npm install

# Verify Tailwind CSS is configured
# (tailwind.config.ts should be present)
```

## ▶️ Running the Project

### Quick Start (Both Services)

**Terminal 1 - Backend Server:**

```bash
cd backend

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Start FastAPI development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend Server:**

```bash
# From project root
npm run dev
```

### Backend Only

```bash
cd backend
venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
uvicorn app.main:app --reload --port 8000
```

### Frontend Only

```bash
npm run dev
```

## 📊 Development Server Details

### Frontend (Next.js)
- **URL:** http://localhost:5366
- **Command:** `npm run dev`
- **Port:** 5366
- **Hot Reload:** ✅ Enabled
- **Build:** `npm run build`
- **Production Start:** `npm run start`

### Backend (FastAPI)
- **URL:** http://127.0.0.1:8000
- **Command:** `uvicorn app.main:app --reload --port 8000`
- **Port:** 8000
- **Hot Reload:** ✅ Enabled (with --reload flag)
- **API Documentation:** http://127.0.0.1:8000/docs (Swagger UI)
- **Alternative Docs:** http://127.0.0.1:8000/redoc (ReDoc)

## 🔌 APIs

All API endpoints are prefixed with `/api/v1`

### Authentication Endpoints
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login

### Assessment Endpoints
- `GET /api/v1/assessment/` - Get assessments
- `POST /api/v1/assessment/test` - Submit assessment answers
- `GET /api/v1/assessment/results` - Get user results

### Profile Endpoints
- `GET /api/v1/profile/` - Get user profile
- `PUT /api/v1/profile/` - Update user profile

### Home Endpoints
- `GET /api/v1/home/` - Get home page data

**API Documentation:**
Visit http://127.0.0.1:8000/docs for interactive Swagger UI documentation when the backend is running.

## ✨ Project Features

### Frontend (Next.js)
- ✅ Modern responsive UI with Tailwind CSS
- ✅ Authentication (Login/Signup)
- ✅ Assessment test interface
- ✅ User profile management
- ✅ Results dashboard
- ✅ Dark/Light theme support
- ✅ Mobile-friendly design

### Backend (FastAPI)
- ✅ RESTful API with FastAPI
- ✅ JWT-based authentication
- ✅ PostgreSQL database integration
- ✅ CORS support for cross-origin requests
- ✅ Automatic API documentation (Swagger UI)
- ✅ Password hashing with bcrypt
- ✅ Multi-Choice Question (MCQ) assessment support

## 🐛 Troubleshooting

### Issue 1: Port Already In Use

**Problem:** `ERROR: address already in use :::5366` or `ERROR: address already in use :::8000`

**Solution:** 
```bash
# Windows - Find and kill process on port
netstat -ano | findstr :5366
taskkill /PID <PID> /F

# macOS/Linux - Find and kill process
lsof -i :5366
kill -9 <PID>

# Or use a different port
npm run dev  # Check package.json for port configuration
uvicorn app.main:app --port 8001  # Use port 8001 instead of 8000
```

### Issue 2: PostgreSQL Connection Error

**Problem:** `could not connect to server` or `FATAL: database "govtech_db" does not exist`

**Solution:**
1. Verify PostgreSQL is running
2. Check your `DATABASE_URL` in `.env.local`
3. Ensure database and user exist
4. Test connection:
```bash
psql -U postgres -d govtech_db
```

### Issue 3: Python Package Installation Fails

**Problem:** `error: Microsoft Visual C++ 14.0 is required`

**Solution (Windows):**
- Install Visual C++ Build Tools: https://visualstudio.microsoft.com/downloads/
- Or reinstall the problematic package:
```bash
pip install --upgrade pip setuptools wheel
```

### Issue 4: Virtual Environment Not Activating

**Problem:** `venv: not found` or activation fails

**Solution:**
```bash
# Recreate virtual environment
rm -rf venv  # or rmdir venv on Windows
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

### Issue 5: Tailwind CSS Not Loading

**Problem:** Styles not applied, missing tailwind.config.ts

**Solution:**
- Ensure `tailwind.config.ts` exists in project root
- Run `npm install` again
- Clear cache: `rm -rf .next` (Windows: `rmdir /s /q .next`)
- Restart dev server: `npm run dev`

### Issue 6: CORS Errors in Frontend

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Verify backend is running on port 8000
2. Check `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL
3. Ensure backend CORS is configured correctly in `backend/app/main.py`
4. Restart both servers

### Issue 7: Environment Variables Not Loading

**Problem:** Backend can't read environment variables from `.env.local`

**Solution:**
1. Ensure `.env.local` exists in project root (not in backend/)
2. Restart the backend server after creating/modifying `.env.local`
3. Check that variable names match exactly (case-sensitive)
4. Verify no extra spaces or quotes around values

## 📝 Common Commands Reference

```bash
# Frontend Commands
npm run dev           # Start development server (port 5366)
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint

# Backend Commands (from backend directory)
pip install -r requirements.txt    # Install dependencies
python create_db.py                # Initialize database tables
uvicorn app.main:app --reload      # Start development server (port 8000)

# Database Commands (PostgreSQL)
psql -U postgres                   # Connect to PostgreSQL
\l                                 # List all databases
\connect govtech_db               # Connect to govtech_db
\dt                               # List all tables in current database
\du                               # List all users/roles
```

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` in `.env.local` to a strong random value
- [ ] Never commit `.env.local` to version control
- [ ] Use HTTPS instead of HTTP
- [ ] Update CORS origins in `backend/app/main.py` for production domains only
- [ ] Use environment-specific database credentials
- [ ] Set secure database passwords (not "admin")
- [ ] Implement rate limiting for production
- [ ] Set secure headers (HSTS, CSP, etc.)
- [ ] Enable HTTPS for JWT tokens
- [ ] Regularly update dependencies:
  - Frontend: `npm audit fix` and `npm update`
  - Backend: `pip install --upgrade -r requirements.txt`

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [JWT Authentication Best Practices](https://tools.ietf.org/html/rfc8949)

## 💡 Tips for Development

1. **Use API Documentation:** Visit http://127.0.0.1:8000/docs while backend is running
2. **Database GUI:** Use pgAdmin (included with PostgreSQL) to visualize data
3. **Frontend Debugging:** Use browser DevTools to debug React components
4. **Hot Reload:** Both servers support hot reload - changes auto-reflect without restart
5. **Environment Variables:** Reload servers after changing `.env.local`

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation at http://127.0.0.1:8000/docs
3. Check console logs for detailed error messages
4. Review error traceback in terminal where servers are running

---

**Happy Development! 🚀**

---

*Last Updated: February 2026*
