from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.config import settings as app_settings
from app.database import init_db
from app.routes import auth, applications

CORS_ORIGINS = app_settings.cors_origins_list


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Winlytics API",
    description="Data-driven career tracking platform API",
    version="1.0.0",
    lifespan=lifespan,
)


class OPTIONSPreflightMiddleware(BaseHTTPMiddleware):
    """Ensure CORS preflight OPTIONS returns 200 with CORS headers only for whitelisted origins."""

    ALLOWED_ORIGINS = set(CORS_ORIGINS)

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.method == "OPTIONS":
            origin = request.headers.get("origin")
            if origin not in self.ALLOWED_ORIGINS:
                return Response(status_code=403, headers={})
            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": request.headers.get("access-control-request-headers", "content-type,authorization"),
                    "Access-Control-Max-Age": "600",
                    "Access-Control-Allow-Credentials": "true",
                },
            )
        return await call_next(request)


app.add_middleware(OPTIONSPreflightMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(applications.router, prefix="/api/applications", tags=["applications"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}
