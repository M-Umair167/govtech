from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
import csv
import os
from app.db.session import get_db
from app.models.mcq import MCQ
from app.schemas.mcq import SubjectCount, MCQ as MCQSchema

router = APIRouter()

@router.get("/overview", response_model=List[SubjectCount])
def get_assessment_overview(db: Session = Depends(get_db)):
    # Group by subject (renamed col)
    results = db.query(MCQ.subject, func.count(MCQ.id).label('total_count')).group_by(MCQ.subject).all()
    detailed_results = db.query(MCQ.subject, MCQ.difficulty_level, func.count(MCQ.id).label('count')).group_by(MCQ.subject, MCQ.difficulty_level).all()
    
    subject_map = {}
    
    for subj_id, diff, count in detailed_results:
        if subj_id not in subject_map:
            subject_map[subj_id] = SubjectCount(subject=subj_id, count=0, difficulty_counts={"Low": 0, "Medium": 0, "Hard": 0})
        
        diff_label = "Low" if diff == 1 else "Medium" if diff == 2 else "Hard"
        subject_map[subj_id].difficulty_counts[diff_label] = count
        subject_map[subj_id].count += count
        
    return list(subject_map.values())

@router.get("/questions", response_model=List[MCQSchema])
def get_questions(
    subject: str = Query(..., alias="subject"),
    difficulty: str = Query("Medium", alias="diff"),
    limit: int = Query(25, alias="count"),
    db: Session = Depends(get_db)
):
    # Using alias parameters to match frontend (subject, diff, count)
    query = db.query(MCQ).filter(MCQ.subject == subject)
    
    if difficulty.lower() != "mix":
        level_map = {"low": 1, "medium": 2, "hard": 3}
        level = level_map.get(difficulty.lower())
        if level:
            query = query.filter(MCQ.difficulty_level == level)
            
    questions = query.order_by(func.random()).limit(limit).all()
    return questions

@router.post("/seed-csv", status_code=status.HTTP_201_CREATED)
def seed_from_csv(force: bool = False, db: Session = Depends(get_db)):
    if db.query(MCQ).count() > 0 and not force:
        return {"message": "Data already exists", "count": db.query(MCQ).count()}
    
    if force:
        # Ensure previous transaction is committed/closed to release locks
        db.commit()
        # Re-create table to ensure schema match
        MCQ.__table__.drop(db.get_bind(), checkfirst=True)
        MCQ.__table__.create(db.get_bind(), checkfirst=True)
        # db.commit() # DDL commit implicit usually

    file_path = os.path.abspath("mcqs_data/questions_data.csv")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"CSV file not found at {file_path}")

    SUBJECT_MAP = {
        "Fundamental Programming": "fp",
        "Data Structure": "ds",
        "Database System": "db",
        "Computer Network": "cn",
        "Software Engineering": "se",
        "Operating System": "os",
        "Object Oriented Programming": "oop",
         "Discrete Structure": "disc",
        "Information Security": "infosec"
    }

    mock_data = []
    
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) < 11: continue
                
                subj_name = row[1].strip()
                subj_id = SUBJECT_MAP.get(subj_name)
                
                if not subj_id:
                     if "Network" in subj_name: subj_id = "cn"
                     elif "Database" in subj_name: subj_id = "db"
                     elif "Data Structure" in subj_name: subj_id = "ds"
                     else: continue 

                q_text = row[3]
                opts = [row[4], row[5], row[6], row[7]]
                explanation = row[9] # Explanation column
                
                correct_char = row[8].strip().lower()
                if len(correct_char) == 1 and 'a' <= correct_char <= 'd':
                    correct_idx = ord(correct_char) - ord('a')
                else:
                    correct_idx = 0
                
                correct_ans = opts[correct_idx]
                
                diff_str = row[10].strip().lower()
                diff_lvl = 1
                if "medium" in diff_str: diff_lvl = 2
                elif "hard" in diff_str: diff_lvl = 3
                
                mcq = MCQ(
                    subject=subj_id,
                    difficulty_level=diff_lvl,
                    question=q_text,
                    option_a=opts[0],
                    option_b=opts[1],
                    option_c=opts[2],
                    option_d=opts[3],
                    correct_answer=correct_ans,
                    explanation=explanation
                )
                mock_data.append(mcq)
                
        db.bulk_save_objects(mock_data)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

from app.models.user import User
from app.models.profile import UserProfile
from app.models.result import UserResult
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user = db.query(User).filter(User.email == email).first()
        if user is None:
             raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

class AssessmentSubmission(BaseModel):
    subject: str
    score: int
    total_questions: int

@router.post("/submit")
def submit_assessment(
    submission: AssessmentSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    accuracy = (submission.score / submission.total_questions) * 100 if submission.total_questions > 0 else 0
    
    result = UserResult(
        user_id=current_user.id,
        subject=submission.subject,
        score=submission.score,
        total_questions=submission.total_questions,
        accuracy=accuracy
    )
    db.add(result)
    
    # Update profile stats
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile:
        profile.tests_taken += 1
        db.flush()
        avg = db.query(func.avg(UserResult.accuracy)).filter(UserResult.user_id == current_user.id).scalar()
        profile.avg_accuracy = round(avg, 2) if avg else round(accuracy, 2)
        
    db.commit()
    return {"message": "Submitted successfully"}
