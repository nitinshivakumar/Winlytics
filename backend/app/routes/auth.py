from datetime import timedelta

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.auth import (
    get_password_hash,
    create_access_token,
    authenticate_user,
    get_current_user,
)
from app.config import settings
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, GoogleTokenRequest, UserResponse, TokenResponse

router = APIRouter()


@router.post("/signup", response_model=TokenResponse)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await authenticate_user(credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.post("/google", response_model=TokenResponse)
async def google_login(data: GoogleTokenRequest, db: AsyncSession = Depends(get_db)):
    if not settings.google_client_id:
        raise HTTPException(
            status_code=503,
            detail="Google Sign-In is not configured. Set GOOGLE_CLIENT_ID on the server.",
        )
    try:
        payload = id_token.verify_oauth2_token(
            data.token,
            google_requests.Request(),
            settings.google_client_id,
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")
    name = payload.get("name") or payload.get("email", "").split("@")[0]
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user:
        # Create user; use a random hash so they can't log in with password unless we add "set password" later
        user = User(
            name=name,
            email=email,
            password_hash=get_password_hash("google-only-" + email),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return current_user
