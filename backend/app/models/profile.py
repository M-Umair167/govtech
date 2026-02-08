from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.models.base import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    title = Column(String, default="GovTech Explorer") # Rank
    tests_taken = Column(Integer, default=0)
    avg_accuracy = Column(Integer, default=0)
    subjects_interested = Column(String, default="[]") # JSON string for array

    user = relationship("User", backref="profile")
