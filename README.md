
# GovTech - Assessment Platform

A modern full-stack assessment platform built with Next.js and FastAPI.

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js**
- **Python**
- **PostgreSQL**

## 🚀 Simple Setup Guide

### 1. Database Setup
Create a PostgreSQL database named `govtech_db`.

```bash
# In your terminal
psql -U postgres
CREATE DATABASE govtech_db;
\q
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env.local
```
*Note: The `.env.local` file comes pre-configured for local development. You likely don't need to change anything unless your database password is different.*

### 3. Backend Setup
Open a new terminal and run:

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows
# source venv/bin/activate       # Mac/Linux

pip install -r requirements.txt
python seed_db.py                # Sets up database tables and dummy data
uvicorn app.main:app --reload    # Starts the backend server
```
*Backend runs on: http://127.0.0.1:8000*

### 4. Frontend Setup
Open another terminal (keep the backend running) and run:

```bash
npm install
npm run dev
```
*Frontend runs on: http://localhost:3000*

## ✅ You're Done!
Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.
