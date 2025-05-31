"""
Redis client configuration and utilities
"""
import redis.asyncio as redis
import json
import logging
from typing import Any, Optional, Dict
from contextlib import asynccontextmanager

from ..config import settings

logger = logging.getLogger(__name__)

# Global Redis client
redis_client: Optional[redis.Redis] = None


async def init_redis():
    """
    Initialize Redis connection
    """
    global redis_client
    
    try:
        redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=50
        )
        
        # Test connection
        await redis_client.ping()
        logger.info("Redis connection initialized successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize Redis: {str(e)}")
        raise


async def close_redis():
    """
    Close Redis connection
    """
    global redis_client
    
    if redis_client:
        await redis_client.close()
        logger.info("Redis connection closed")


def get_redis() -> redis.Redis:
    """
    Get Redis client instance
    """
    if not redis_client:
        raise RuntimeError("Redis client not initialized")
    return redis_client


class RedisCache:
    """
    Redis cache wrapper with JSON serialization
    """
    def __init__(self, prefix: str = "cache", ttl: int = 3600):
        self.prefix = prefix
        self.ttl = ttl
        self.client = get_redis()
    
    def _make_key(self, key: str) -> str:
        """
        Create a namespaced key
        """
        return f"{self.prefix}:{key}"
    
    async def get(self, key: str) -> Optional[Any]:
        """
        Get value from cache
        """
        try:
            value = await self.client.get(self._make_key(key))
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Redis get error: {str(e)}")
            return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """
        Set value in cache
        """
        try:
            ttl = ttl or self.ttl
            serialized = json.dumps(value)
            await self.client.setex(
                self._make_key(key),
                ttl,
                serialized
            )
            return True
        except Exception as e:
            logger.error(f"Redis set error: {str(e)}")
            return False
    
    async def delete(self, key: str) -> bool:
        """
        Delete value from cache
        """
        try:
            await self.client.delete(self._make_key(key))
            return True
        except Exception as e:
            logger.error(f"Redis delete error: {str(e)}")
            return False
    
    async def exists(self, key: str) -> bool:
        """
        Check if key exists
        """
        try:
            return await self.client.exists(self._make_key(key)) > 0
        except Exception as e:
            logger.error(f"Redis exists error: {str(e)}")
            return False


class RedisPubSub:
    """
    Redis pub/sub wrapper
    """
    def __init__(self):
        self.client = get_redis()
        self.pubsub = None
    
    async def subscribe(self, *channels: str):
        """
        Subscribe to channels
        """
        self.pubsub = self.client.pubsub()
        await self.pubsub.subscribe(*channels)
        logger.info(f"Subscribed to channels: {channels}")
    
    async def unsubscribe(self, *channels: str):
        """
        Unsubscribe from channels
        """
        if self.pubsub:
            await self.pubsub.unsubscribe(*channels)
            logger.info(f"Unsubscribed from channels: {channels}")
    
    async def publish(self, channel: str, message: Dict[str, Any]) -> int:
        """
        Publish message to channel
        """
        try:
            serialized = json.dumps(message)
            return await self.client.publish(channel, serialized)
        except Exception as e:
            logger.error(f"Redis publish error: {str(e)}")
            return 0
    
    async def listen(self):
        """
        Listen for messages
        """
        if not self.pubsub:
            raise RuntimeError("Not subscribed to any channels")
        
        async for message in self.pubsub.listen():
            if message['type'] == 'message':
                try:
                    data = json.loads(message['data'])
                    yield {
                        'channel': message['channel'],
                        'data': data
                    }
                except json.JSONDecodeError:
                    logger.error(f"Failed to decode message: {message['data']}")
    
    async def close(self):
        """
        Close pub/sub connection
        """
        if self.pubsub:
            await self.pubsub.close()


# Rate limiter using Redis
class RateLimiter:
    """
    Token bucket rate limiter using Redis
    """
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.client = get_redis()
    
    async def is_allowed(self, key: str) -> bool:
        """
        Check if request is allowed
        """
        try:
            pipe = self.client.pipeline()
            now = int(time.time())
            window_start = now - self.window_seconds
            
            # Remove old entries
            pipe.zremrangebyscore(key, 0, window_start)
            
            # Count current entries
            pipe.zcard(key)
            
            # Add current request
            pipe.zadd(key, {str(now): now})
            
            # Set expiry
            pipe.expire(key, self.window_seconds)
            
            results = await pipe.execute()
            current_requests = results[1]
            
            return current_requests < self.max_requests
            
        except Exception as e:
            logger.error(f"Rate limiter error: {str(e)}")
            # Allow request on error
            return True


import time