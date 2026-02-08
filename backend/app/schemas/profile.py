from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    bio: Optional[str] = None
    location: Optional[str] = None
    subjects_interested: List[str] = []

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    full_name: Optional[str] = None

class UserHistoryItem(BaseModel):
    id: int
    subject: str
    score: int
    total_questions: int
    accuracy: float
    created_at: datetime

    class Config:
        from_attributes = True

class UserProfileResponse(UserProfileBase):

    id: int
    user_id: int
    avatar_url: Optional[str] = None
    title: str
    tests_taken: int
    avg_accuracy: int
    email: str # From User model
    full_name: Optional[str] = None # From User model

    class Config:
        from_attributes = True
