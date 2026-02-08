from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserResponse
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    
    # Check if user exists
    if repo.get_by_email(user_in.email):
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )
    
    hashed_pw = get_password_hash(user_in.password)
    
    user_data = {
        "full_name": user_in.full_name,
        "email": user_in.email,
        "hashed_password": hashed_pw,
        "provider": "local"
    }
    
    user = repo.create(user_data)
    
    # Auto-create profile
    from app.models.profile import UserProfile
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()
    
    return user
