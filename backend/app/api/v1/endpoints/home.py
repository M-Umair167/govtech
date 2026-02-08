from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.user import User
from app.models.mcq import MCQ

router = APIRouter()

@router.get("/stats")
def get_home_stats(db: Session = Depends(get_db)):
    users_count = db.query(User).count()
    questions_count = db.query(MCQ).count()
    # Distinct subjects
    subjects_count = db.query(MCQ.subject).distinct().count()
    
    return {
        "users": users_count,
        "questions": questions_count,
        "subjects": subjects_count
    }
