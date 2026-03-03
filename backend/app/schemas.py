from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


# Auth
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72, description="Password (6–72 characters)")


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleTokenRequest(BaseModel):
    token: str  # Google ID token from frontend


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# Applications
class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str = "Applied"
    date_applied: date
    source: Optional[str] = None
    notes: Optional[str] = None


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    date_applied: Optional[date] = None
    source: Optional[str] = None
    notes: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    company: str
    role: str
    status: str
    date_applied: date
    source: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Dashboard stats
class DashboardStats(BaseModel):
    total_applications: int
    interviews_scheduled: int
    offers_received: int
    rejections: int
    conversion_rate: float
