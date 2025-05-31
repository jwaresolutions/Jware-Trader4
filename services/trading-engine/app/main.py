"""
Trading Engine Service - Main Application
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import json
import time
import uuid
from typing import Dict, Any

from .config import settings
from .database import init_db, close_db
from .routers import health, auth, trading, accounts
from .utils.logging import setup_logging
from .utils.redis_client import init_redis, close_redis

# Setup structured logging
logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle
    """
    # Startup
    logger.info("Starting Trading Engine Service", 
                environment=settings.PYTHON_ENV,
                version="1.0.0")
    
    # Initialize database
    await init_db()
    logger.info("Database connection established")
    
    # Initialize Redis
    await init_redis()
    logger.info("Redis connection established")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Trading Engine Service")
    await close_db()
    await close_redis()
    logger.info("All connections closed")


# Create FastAPI app
app = FastAPI(
    title="Jware Trading Engine",
    description="Core trading engine for automated trading platform",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.PYTHON_ENV == "development" else settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Middleware for request logging and correlation ID
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log all requests with correlation ID
    """
    # Generate or extract correlation ID
    correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
    
    # Store correlation ID in request state
    request.state.correlation_id = correlation_id
    
    # Log request
    start_time = time.time()
    logger.info(
        "Request received",
        method=request.method,
        path=request.url.path,
        correlation_id=correlation_id,
        client_host=request.client.host if request.client else None
    )
    
    # Process request
    try:
        response = await call_next(request)
        
        # Calculate request duration
        duration = time.time() - start_time
        
        # Log response
        logger.info(
            "Request completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration=round(duration, 3),
            correlation_id=correlation_id
        )
        
        # Add correlation ID to response headers
        response.headers["X-Correlation-ID"] = correlation_id
        
        return response
        
    except Exception as e:
        # Log error
        duration = time.time() - start_time
        logger.error(
            "Request failed",
            method=request.method,
            path=request.url.path,
            error=str(e),
            duration=round(duration, 3),
            correlation_id=correlation_id,
            exc_info=True
        )
        
        # Return error response
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "correlation_id": correlation_id,
                "message": "An unexpected error occurred"
            },
            headers={"X-Correlation-ID": correlation_id}
        )


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Handle all unhandled exceptions
    """
    correlation_id = getattr(request.state, "correlation_id", str(uuid.uuid4()))
    
    logger.error(
        "Unhandled exception",
        error=str(exc),
        correlation_id=correlation_id,
        path=request.url.path,
        method=request.method,
        exc_info=True
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "correlation_id": correlation_id,
            "message": "An unexpected error occurred"
        },
        headers={"X-Correlation-ID": correlation_id}
    )


# Include routers
app.include_router(health.router, tags=["health"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["accounts"])
app.include_router(trading.router, prefix="/api/v1/trading", tags=["trading"])


@app.get("/")
async def root():
    """
    Root endpoint
    """
    return {
        "service": "Trading Engine",
        "version": "1.0.0",
        "status": "running",
        "environment": settings.PYTHON_ENV
    }


# Graceful shutdown handler
import signal
import sys

def signal_handler(sig, frame):
    """
    Handle shutdown signals
    """
    logger.info("Received shutdown signal", signal=sig)
    sys.exit(0)

# Register signal handlers
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)