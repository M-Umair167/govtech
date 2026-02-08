from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.profile import UserProfile
from app.models.result import UserResult
from app.schemas.profile import UserProfileUpdate, UserProfileResponse, UserHistoryItem
from typing import List, Optional
import json

# Placeholder for actual auth dependency
# In a real app, you would have a function to get the current user from the token
# creating a mock one or a simple email-based lookup for now based on header if no full jwt logic is visible yet
# But I see 'auth.py' in frontend, implies JWT. backend might have `get_current_user` utility?
# I'll check for it. For now, I'll write the logic assuming we can get user_id.

router = APIRouter()

# --- MOCK AUTH UTILITY (To be replaced by real auth) ---
# Since I cannot see the full auth implementation in previous context (it was truncated), 
# I will assume there is a `get_current_user` dependency available or I will create a basic one.
# For this turn, I'll assume we pass 'Authorization' header and I'll simulate extracting user.
# ACTUALLY, I'll trust that the user has a way to get the user ID. 
# Better: I will implement a basic JWT decode here if `jose` is installed, or query by email from body (insecure but works for logic).
# Wait, I don't want to break things. Let's look for `app/core/security.py` or similar later.
# For now, I will use a dependency that queries by a Header "X-User-Email" for simplicity in this rapid iteration 
# IF standard JWT isn't fully visible.
# BUT, looking at `login.py` (which I didn't see fully), it returns a token. 
# I'll import `get_current_active_user` if it exists. If not, I'll create a simple look up.

from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        user = db.query(User).filter(User.email == email).first()
        if user is None:
             raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")


@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    
    # Create profile if not exists
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    
    # Parse subjects
    try:
        subjects = json.loads(profile.subjects_interested)
    except:
        subjects = []

    return UserProfileResponse(
        id=profile.id,
        user_id=current_user.id,
        avatar_url=profile.avatar_url,
        bio=profile.bio,
        location=profile.location,
        title=profile.title,
        tests_taken=profile.tests_taken,
        avg_accuracy=profile.avg_accuracy,
        subjects_interested=subjects,
        email=current_user.email,
        full_name=current_user.full_name
    )

from fastapi import File, UploadFile
import shutil
from pathlib import Path
import uuid

# ... imports ...

@router.post("/avatar", response_model=UserProfileResponse)
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
    
    # Save file
    file_extension = Path(file.filename).suffix
    file_name = f"{current_user.id}_{uuid.uuid4()}{file_extension}"
    upload_path = Path("static/uploads") / file_name
    
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update profile
    # We will store the path relative to backend, e.g., "/static/uploads/..."
    # The frontend needs to point to http://localhost:8000/static/uploads/...
    profile.avatar_url = f"/static/uploads/{file_name}"
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    try:
        subjects = json.loads(profile.subjects_interested)
    except:
        subjects = []

    return UserProfileResponse(
        id=profile.id,
        user_id=current_user.id,
        avatar_url=profile.avatar_url,
        bio=profile.bio,
        location=profile.location,
        title=profile.title,
        tests_taken=profile.tests_taken,
        avg_accuracy=profile.avg_accuracy,
        subjects_interested=subjects,
        email=current_user.email,
        full_name=current_user.full_name
    )

@router.put("/me", response_model=UserProfileResponse)
def update_my_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit() 
    
    if profile_in.bio is not None:
        profile.bio = profile_in.bio
    
    if profile_in.location is not None:
        profile.location = profile_in.location
        
    if profile_in.subjects_interested is not None:
        profile.subjects_interested = json.dumps(profile_in.subjects_interested)
        
    if profile_in.full_name is not None:
        current_user.full_name = profile_in.full_name
        db.add(current_user)

    db.add(profile)
    db.commit()
    db.refresh(profile)
    db.refresh(current_user)

    try:
        subjects = json.loads(profile.subjects_interested)
    except:
        subjects = []

    return UserProfileResponse(
        id=profile.id,
        user_id=current_user.id,
        avatar_url=profile.avatar_url,
        bio=profile.bio,
        location=profile.location,
        title=profile.title,
        tests_taken=profile.tests_taken,
        avg_accuracy=profile.avg_accuracy,
        subjects_interested=subjects,
        email=current_user.email,
        full_name=current_user.full_name
    )

@router.get("/history", response_model=List[UserHistoryItem])
def get_user_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(UserResult)\
        .filter(UserResult.user_id == current_user.id)\
        .order_by(UserResult.created_at.desc())\
        .all()
    return history

