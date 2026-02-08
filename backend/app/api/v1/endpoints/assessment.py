
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.api import deps
from app.models.mcq import MCQ
from app.models.result import UserResult
from app.models.profile import UserProfile
from app.models.user import User
from app.schemas.mcq import SubjectCount, MCQ as MCQSchema
from app.schemas.assessment import (
    AssessmentSubmission,
    AssessmentResultResponse,
    QuestionDetailResponse
)
from app.utils.seeding import seed_mcqs_from_csv

router = APIRouter()

@router.get("/overview", response_model=List[SubjectCount])
def get_assessment_overview(db: Session = Depends(deps.get_db)):
    results = db.query(MCQ.subject, MCQ.difficulty_level, func.count(MCQ.id).label('count'))\
        .group_by(MCQ.subject, MCQ.difficulty_level).all()
    
    subject_map = {}
    
    for subj_id, diff, count in results:
        if subj_id not in subject_map:
            subject_map[subj_id] = SubjectCount(
                subject=subj_id, 
                count=0, 
                difficulty_counts={"Low": 0, "Medium": 0, "Hard": 0}
            )
        
        diff_label = "Low" if diff == 1 else "Medium" if diff == 2 else "Hard"
        subject_map[subj_id].difficulty_counts[diff_label] = count
        subject_map[subj_id].count += count
        
    return list(subject_map.values())

@router.get("/questions", response_model=List[MCQSchema])
def get_questions(
    subject: str = Query(..., alias="subject"),
    difficulty: str = Query("Medium", alias="diff"),
    limit: int = Query(25, alias="count"),
    db: Session = Depends(deps.get_db)
):
    query = db.query(MCQ).filter(MCQ.subject == subject)
    
    if difficulty.lower() != "mix":
        level_map = {"low": 1, "medium": 2, "hard": 3}
        level = level_map.get(difficulty.lower())
        if level:
            query = query.filter(MCQ.difficulty_level == level)
            
    # Note: func.random() can be slow on very large datasets but is fine for this scale.
    questions = query.order_by(func.random()).limit(limit).all()
    return questions

@router.post("/seed-csv", status_code=status.HTTP_201_CREATED)
def seed_from_csv(force: bool = False, db: Session = Depends(deps.get_db)):
    return seed_mcqs_from_csv(db, force)

@router.get("/result/{result_id}", response_model=AssessmentResultResponse)
def get_assessment_result(
    result_id: int,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    result = db.query(UserResult).filter(
        UserResult.id == result_id, 
        UserResult.user_id == current_user.id
    ).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    
    questions_data = []
    if result.answers:
        # Optimize: Fetch all relevant MCQs in one query
        question_ids = [int(qid) for qid in result.answers.keys()]
        if question_ids:
            mcqs = db.query(MCQ).filter(MCQ.id.in_(question_ids)).all()
            mcq_map = {m.id: m for m in mcqs}
            
            for qid_str, selected in result.answers.items():
                qid = int(qid_str)
                mcq = mcq_map.get(qid)
                if mcq:
                    questions_data.append(QuestionDetailResponse(
                        id=mcq.id,
                        question=mcq.question,
                        options=[mcq.option_a, mcq.option_b, mcq.option_c, mcq.option_d],
                        selected_answer=selected,
                        correct_answer=mcq.correct_answer,
                        explanation=mcq.explanation or "No explanation provided."
                    ))
    
    return AssessmentResultResponse(
        id=result.id,
        subject=result.subject,
        score=result.score,
        total_questions=result.total_questions,
        accuracy=result.accuracy,
        created_at=result.created_at,
        questions=questions_data
    )

@router.post("/submit")
def submit_assessment(
    submission: AssessmentSubmission,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    accuracy = 0
    if submission.total_questions > 0:
        accuracy = (submission.score / submission.total_questions) * 100
        
    result = UserResult(
        user_id=current_user.id,
        subject=submission.subject,
        score=submission.score,
        total_questions=submission.total_questions,
        accuracy=accuracy,
        answers=submission.answers
    )
    db.add(result)
    
    # Update profile stats
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if profile:
        profile.tests_taken += 1
        db.flush()
        # Calculate new average accuracy efficiently
        # Using a direct SQL aggregation is better than fetching all user results
        avg = db.query(func.avg(UserResult.accuracy)).filter(UserResult.user_id == current_user.id).scalar()
        profile.avg_accuracy = round(avg, 2) if avg is not None else round(accuracy, 2)
        
    db.commit()
    return {"message": "Submitted successfully"}
