from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import signup, login, home, contact
from app.models.base import Base
from app.db.session import engine
# Import all models so Base.metadata knows about them
import app.models.user
import app.models.profile
import app.models.mcq
import app.models.result 
from app.db.utils import ensure_db_exists

# Create database if it doesn't exist
# ensure_db_exists()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GovTech API")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5366",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://192.168.1.10:5366",
    "http://192.168.1.10:3000",
    "https://your-app.vercel.app",
    "https://1pczgwxx-5366.inc1.devtunnels.ms",
    "https://1pczgwxx-5366.inc1.devtunnels.ms/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + ["https://1pczgwxx-5366.inc1.devtunnels.ms"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signup.router, prefix="/api/v1/auth", tags=["signup"])
app.include_router(login.router, prefix="/api/v1/auth", tags=["login"])
app.include_router(home.router, prefix="/api/v1/home", tags=["home"])
app.include_router(contact.router, prefix="/api/v1", tags=["contact"])
from app.api.v1.endpoints import profile, assessment
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])
app.include_router(assessment.router, prefix="/api/v1/assessment", tags=["assessment"])

from fastapi.staticfiles import StaticFiles
import os

# Create uploads directory if not exists
os.makedirs("static/uploads", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to GovTech API"}
