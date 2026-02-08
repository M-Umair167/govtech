from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class MCQBase(BaseModel):
    subject: str
    difficulty_level: int
    question: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None

class MCQ(MCQBase):
    id: int

    class Config:
        from_attributes = True

class SubjectCount(BaseModel):
    subject: str
    count: int
    difficulty_counts: Dict[str, int]
