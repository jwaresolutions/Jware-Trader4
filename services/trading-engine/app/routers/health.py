"""
Health check endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
import logging
from typing import Dict, Any

from ..database import get_db
from ..utils.redis_client import get_redis
from ..config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint
    """
    return {
        "status": "healthy",
        "service": "trading-engine",
        "version": "1.0.0",
        "environment": settings.PYTHON_ENV
    }


@router.get("/health/detailed")
async def detailed_health_check(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """
    Detailed health check with dependency status
    """
    health_status = {
        "status": "healthy",
        "service": "trading-engine",
        "version": "1.0.0",
        "environment": settings.PYTHON_ENV,
        "checks": {
            "database": {"status": "unknown"},
            "redis": {"status": "unknown"}
        }
    }
    
    # Check database
    try:
        result = await db.execute(text("SELECT 1"))
        await db.commit()
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "Database connection successful"
        }
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}"
        }
        logger.error(f"Database health check failed: {str(e)}")
    
    # Check Redis
    try:
        redis_client = get_redis()
        await redis_client.ping()
        health_status["checks"]["redis"] = {
            "status": "healthy",
            "message": "Redis connection successful"
        }
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "message": f"Redis connection failed: {str(e)}"
        }
        logger.error(f"Redis health check failed: {str(e)}")
    
    return health_status


@router.get("/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """
    Readiness check for Kubernetes
    """
    try:
        # Check database
        await db.execute(text("SELECT 1"))
        await db.commit()
        
        # Check Redis
        redis_client = get_redis()
        await redis_client.ping()
        
        return {"status": "ready"}
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}")
        return {"status": "not ready", "error": str(e)}


@router.get("/live")
async def liveness_check() -> Dict[str, Any]:
    """
    Liveness check for Kubernetes
    """
    return {"status": "alive"}