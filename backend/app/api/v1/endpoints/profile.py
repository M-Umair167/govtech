
import json
import shutil
import uuid
from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.profile import UserProfile
from app.models.result import UserResult
from app.schemas.profile import UserProfileUpdate, UserProfileResponse, UserHistoryItem

router = APIRouter()

def get_profile_response(profile: UserProfile, user: User) -> UserProfileResponse:
    try:
        subjects = json.loads(profile.subjects_interested) if profile.subjects_interested else []
    except json.JSONDecodeError:
        subjects = []
    
    return UserProfileResponse(
        id=profile.id,
        user_id=user.id,
        avatar_url=profile.avatar_url,
        bio=profile.bio,
        location=profile.location,
        title=profile.title,
        tests_taken=profile.tests_taken,
        avg_accuracy=profile.avg_accuracy,
        subjects_interested=subjects,
        email=user.email,
        full_name=user.full_name
    )

def ensure_profile_exists(db: Session, user_id: int) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get("/me", response_model=UserProfileResponse)
def get_my_profile(
    current_user: User = Depends(deps.get_current_user), 
    db: Session = Depends(deps.get_db)
):
    profile = ensure_profile_exists(db, current_user.id)
    return get_profile_response(profile, current_user)

@router.post("/avatar", response_model=UserProfileResponse)
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    profile = ensure_profile_exists(db, current_user.id)
    
    # Ensure upload directory exists
    upload_dir = Path("static/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Save file
    file_extension = Path(file.filename).suffix
    file_name = f"{current_user.id}_{uuid.uuid4()}{file_extension}"
    upload_path = upload_dir / file_name
    
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update profile
    profile.avatar_url = f"/static/uploads/{file_name}"
    db.add(profile)
    db.commit()
    db.refresh(profile)
    
    return get_profile_response(profile, current_user)

@router.put("/me", response_model=UserProfileResponse)
def update_my_profile(
    profile_in: UserProfileUpdate,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    profile = ensure_profile_exists(db, current_user.id)
    
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

    return get_profile_response(profile, current_user)

@router.get("/history", response_model=List[UserHistoryItem])
def get_user_history(
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    history = db.query(UserResult)\
        .filter(UserResult.user_id == current_user.id)\
        .order_by(UserResult.created_at.desc())\
        .all()
    return history
