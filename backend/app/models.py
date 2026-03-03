from datetime import datetime, date
from sqlalchemy import Column, Integer, String, DateTime, Date, Float, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="user", cascade="all, delete-orphan")
    offers = relationship("Offer", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="user", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    status = Column(String(50), default="Applied")  # Applied, Interview, Offer, Rejected
    date_applied = Column(Date, nullable=False)
    source = Column(String(255))  # LinkedIn, Indeed, etc.
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"))
    company = Column(String(255), nullable=False)
    round_type = Column(String(100))  # Phone, Technical, On-site, etc.
    date = Column(Date)
    outcome = Column(String(50))  # Pending, Passed, Failed
    feedback = Column(Text)
    confidence_score = Column(Integer)  # 1-10
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="interviews")


class Offer(Base):
    __tablename__ = "offers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"))
    company = Column(String(255), nullable=False)
    salary = Column(Float)
    bonus = Column(Float)
    location = Column(String(255))
    remote_hybrid = Column(String(50))  # Remote, Hybrid, On-site
    accepted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="offers")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    applications_sent = Column(Integer, default=0)
    networking_messages = Column(Integer, default=0)
    interview_prep_hours = Column(Float, default=0)
    reflection_notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="activities")
