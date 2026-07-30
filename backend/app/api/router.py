from fastapi import APIRouter
from app.api.routes import health_router, upload_router, render_router, analyze_router

api_router = APIRouter()

api_router.include_router(health_router)
api_router.include_router(upload_router)
api_router.include_router(render_router)
api_router.include_router(analyze_router)
