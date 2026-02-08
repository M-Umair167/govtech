
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class AssessmentSubmission(BaseModel):
    subject: str
    score: int
    total_questions: int
    answers: Dict[int, str] = {} # question_id -> selected_option

class QuestionDetailResponse(BaseModel):
    id: int
    question: str
    options: List[str]
    selected_answer: str
    correct_answer: str
    explanation: str

class AssessmentResultResponse(BaseModel):
    id: int
    subject: str
    score: int
    total_questions: int
    accuracy: float
    created_at: datetime
    questions: List[QuestionDetailResponse] = []
    
    class Config:
        from_attributes = True
