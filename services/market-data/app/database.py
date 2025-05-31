"""
Database configuration and session management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import MetaData
import logging
from contextlib import asynccontextmanager

from .config import settings

logger = logging.getLogger(__name__)

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.PYTHON_ENV == "development",
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
    pool_recycle=3600,
)

# Create session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# Create base class for models
metadata = MetaData()
Base = declarative_base(metadata=metadata)


async def init_db():
    """
    Initialize database connection
    """
    try:
        # Test connection
        async with engine.begin() as conn:
            from sqlalchemy import text
            await conn.execute(text("SELECT 1"))
        logger.info("Database connection initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise


async def close_db():
    """
    Close database connection
    """
    await engine.dispose()
    logger.info("Database connection closed")


@asynccontextmanager
async def get_session():
    """
    Provide a transactional scope for database operations
    """
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_db():
    """
    Dependency for FastAPI routes
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()