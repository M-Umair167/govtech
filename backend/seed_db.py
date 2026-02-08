
import os
import sys
import logging
import random
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.session import engine, SessionLocal
from app.models.base import Base
from app.models.user import User
from app.models.profile import UserProfile
from app.models.mcq import MCQ
from app.models.result import UserResult
from app.utils.seeding import seed_mcqs_from_csv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def reset_database():
    logger.info("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database reset complete.")

def seed_users(db: Session):
    logger.info("Seeding users...")
    
    # Create a test user
    test_user = User(
        email="test@example.com",
        full_name="Test User",
        hashed_password=hash_password("password123"),
        provider="local",
        is_active=True
    )
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    
    # Create profile for test user
    profile = UserProfile(
        user_id=test_user.id,
        bio="I am a test user.",
        location="Test City",
        title="GovTech Novice",
        tests_taken=0,
        avg_accuracy=0,
        subjects_interested="[]"
    )
    db.add(profile)
    db.commit()
    logger.info(f"User {test_user.email} created with ID {test_user.id}")
    return test_user

def seed_results(db: Session, user_id: int):
    logger.info("Seeding dummy results...")
    
    # Fetch 5 random MCQs for FP
    fp_mcqs = db.query(MCQ).filter(MCQ.subject == "fp").limit(5).all()
    if fp_mcqs:
        answers = {}
        score = 0
        for mcq in fp_mcqs:
            # Randomly guess, 80% chance correct
            if random.random() < 0.8:
                answers[str(mcq.id)] = mcq.correct_answer
                score += 1
            else:
                answers[str(mcq.id)] = "Wrong Answer"
        
        r1 = UserResult(
            user_id=user_id,
            subject="fp",
            score=score,
            total_questions=len(fp_mcqs),
            accuracy=(score/len(fp_mcqs))*100,
            answers=answers
        )
        db.add(r1)

    # Fetch 5 random MCQs for DS
    ds_mcqs = db.query(MCQ).filter(MCQ.subject == "ds").limit(5).all()
    if ds_mcqs:
        answers = {}
        score = 0
        for mcq in ds_mcqs:
            if random.random() < 0.7:
                answers[str(mcq.id)] = mcq.correct_answer
                score += 1
            else:
                answers[str(mcq.id)] = "Wrong Answer"

        r2 = UserResult(
            user_id=user_id,
            subject="ds",
            score=score,
            total_questions=len(ds_mcqs),
            accuracy=(score/len(ds_mcqs))*100,
            answers=answers
        )
        db.add(r2)

    db.commit()
    logger.info("Dummy results added with detailed answers.")

def main():
    db = SessionLocal()
    try:
        reset_database()
        user = seed_users(db)
        
        logger.info("Seeding MCQs...")
        seed_mcqs_from_csv(db, force=False)
        
        seed_results(db, user.id)
        
        logger.info("Database seeding completed successfully.")
    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
