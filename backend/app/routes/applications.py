from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models import User, Application
from app.schemas import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
    DashboardStats,
)

router = APIRouter()


@router.get("/", response_model=List[ApplicationResponse])
async def list_applications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(Application.user_id == current_user.id).order_by(Application.date_applied.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=ApplicationResponse)
async def create_application(
    data: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    app = Application(user_id=current_user.id, **data.model_dump())
    db.add(app)
    await db.commit()
    await db.refresh(app)
    return app


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = await db.scalar(
        select(func.count(Application.id)).where(Application.user_id == current_user.id)
    )
    interviews = await db.scalar(
        select(func.count(Application.id)).where(
            Application.user_id == current_user.id,
            Application.status == "Interview",
        )
    )
    offers = await db.scalar(
        select(func.count(Application.id)).where(
            Application.user_id == current_user.id,
            Application.status == "Offer",
        )
    )
    rejections = await db.scalar(
        select(func.count(Application.id)).where(
            Application.user_id == current_user.id,
            Application.status == "Rejected",
        )
    )
    conversion = (offers / total * 100) if total else 0.0
    return DashboardStats(
        total_applications=total or 0,
        interviews_scheduled=interviews or 0,
        offers_received=offers or 0,
        rejections=rejections or 0,
        conversion_rate=round(conversion, 1),
    )


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(
            Application.id == application_id,
            Application.user_id == current_user.id,
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app


@router.patch("/{application_id}", response_model=ApplicationResponse)
async def update_application(
    application_id: int,
    data: ApplicationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(
            Application.id == application_id,
            Application.user_id == current_user.id,
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(app, k, v)
    await db.commit()
    await db.refresh(app)
    return app


@router.delete("/{application_id}")
async def delete_application(
    application_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Application).where(
            Application.id == application_id,
            Application.user_id == current_user.id,
        )
    )
    app = result.scalar_one_or_none()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    await db.delete(app)
    await db.commit()
    return {"ok": True}
