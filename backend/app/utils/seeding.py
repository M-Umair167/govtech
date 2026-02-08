
import os
import csv
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.mcq import MCQ

def seed_mcqs_from_csv(db: Session, force: bool = False):
    if db.query(MCQ).count() > 0 and not force:
        return {"message": "Data already exists", "count": db.query(MCQ).count()}
    
    if force:
        db.commit()
        MCQ.__table__.drop(db.get_bind(), checkfirst=True)
        MCQ.__table__.create(db.get_bind(), checkfirst=True)

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
        return {"message": "Data seeded successfully", "count": len(mock_data)}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
