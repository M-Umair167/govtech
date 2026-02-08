
import csv
import os
import sys
import logging
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

def seed_mcqs(db: Session, csv_path: str):
    logger.info(f"Seeding MCQs from {csv_path}...")
    
    if not os.path.exists(csv_path):
        logger.error(f"CSV file not found: {csv_path}")
        return

    # Map CSV subject names to Frontend IDs
    SUBJECT_MAP = {
        "Fundamental Programming": "fp",
        "Data Structure": "ds",
        "Data Structures": "ds",
        "Database System": "db",
        "DataBase": "db",
        "Computer Network": "cn",
        "Software Engineering": "se",
        "Operating System": "os",
        "Object Oriented Programming": "oop",
        "OOP": "oop",
        "Discrete Structure": "disc",
        "Information Security": "infosec",
        "Infosec": "infosec"
    }

    count = 0
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        
        difficulty_map = {
            "Easy": 1,
            "Medium": 2,
            "Hard": 3
        }

        for row in reader:
            if len(row) < 11:
                continue
            
            try:
                subject_raw = row[1].strip()
                # Try direct match
                subject_id = SUBJECT_MAP.get(subject_raw)
                
                # If no exact match, try partials or heuristics similar to the original seed logic
                if not subject_id:
                     if "Network" in subject_raw: subject_id = "cn"
                     elif "Database" in subject_raw: subject_id = "db"
                     elif "Data Structure" in subject_raw: subject_id = "ds"
                     elif "Security" in subject_raw: subject_id = "infosec"
                     elif "Discrete" in subject_raw: subject_id = "disc"
                     else: 
                         # Skip if we really can't map it, or use raw if you want fallback
                         # logger.warning(f"Could not map subject: {subject_raw}")
                         continue 

                question = row[3].strip()
                opt_a = row[4].strip()
                opt_b = row[5].strip()
                opt_c = row[6].strip()
                opt_d = row[7].strip()
                correct_char = row[8].lower().strip() # 'a', 'b', 'c', 'd'
                explanation = row[9].strip()
                diff_str = row[10].strip()
                
                difficulty = difficulty_map.get(diff_str, 1) # Default to 1 if unknown

                # Determine full correct answer text
                if correct_char == 'a': correct_ans = opt_a
                elif correct_char == 'b': correct_ans = opt_b
                elif correct_char == 'c': correct_ans = opt_c
                elif correct_char == 'd': correct_ans = opt_d
                else: correct_ans = opt_a # Fallback

                mcq = MCQ(
                    subject=subject_id, # Store the ID (e.g. 'fp') not the name
                    difficulty_level=difficulty,
                    question=question,
                    option_a=opt_a,
                    option_b=opt_b,
                    option_c=opt_c,
                    option_d=opt_d,
                    correct_answer=correct_ans,
                    explanation=explanation
                )
                db.add(mcq)
                count += 1
            except Exception as e:
                logger.error(f"Error processing row {row}: {e}")

    db.commit()
    logger.info(f"Seeded {count} MCQs.")

def seed_results(db: Session, user_id: int):
    logger.info("Seeding dummy results...")
    # Add some dummy results using the correct IDs
    r1 = UserResult(
        user_id=user_id,
        subject="fp", # Fundamental Programming ID
        score=8,
        total_questions=10,
        accuracy=80.0
    )
    r2 = UserResult(
        user_id=user_id,
        subject="ds", # Data Structure ID
        score=15,
        total_questions=20,
        accuracy=75.0
    )
    db.add(r1)
    db.add(r2)
    db.commit()
    logger.info("Dummy results added.")

def main():
    db = SessionLocal()
    try:
        reset_database()
        user = seed_users(db)
        
        csv_path = os.path.join(os.path.dirname(__file__), "mcqs_data", "questions_data.csv")
        seed_mcqs(db, csv_path)
        
        seed_results(db, user.id)
        
        logger.info("Database seeding completed successfully.")
    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
