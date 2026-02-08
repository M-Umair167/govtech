from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.models.base import Base

class UserResult(Base):
    __tablename__ = "user_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    subject = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    accuracy = Column(Float, nullable=False)
    answers = Column(JSON, nullable=True) # Stores list of {question_id, selected_answer, is_correct}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
