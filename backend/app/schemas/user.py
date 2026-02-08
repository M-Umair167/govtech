from pydantic import BaseModel, EmailStr, validator
import re

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    @validator('password')
    def validate_password(cls, v):
        if len(v) <= 6:
            raise ValueError('Password must be greater than 6 characters')
        if not re.search(r"[a-zA-Z]", v):
            raise ValueError('Password must contain letters')
        if not re.search(r"\d", v):
            raise ValueError('Password must contain numbers')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must contain special characters')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str | None
    provider: str

    class Config:
        from_attributes = True
