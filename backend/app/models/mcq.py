from sqlalchemy import Column, Integer, String, Text
from app.models.base import Base

class MCQ(Base):
    __tablename__ = "mcq"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(50), nullable=False, index=True)
    difficulty_level = Column(Integer, nullable=False)
    question = Column(Text, nullable=False)
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    correct_answer = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=True)

    @property
    def options(self):
        return [self.option_a, self.option_b, self.option_c, self.option_d]
