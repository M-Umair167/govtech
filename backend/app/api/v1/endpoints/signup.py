
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.profile import UserProfile
from app.schemas.user import UserCreate, UserResponse
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserCreate, db: Session = Depends(deps.get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    hashed_pw = get_password_hash(user_in.password)
    
    user = User(
        full_name=user_in.full_name,
        email=user_in.email,
        hashed_password=hashed_pw,
        provider="local"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Auto-create profile
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    
    return user
