from redis import Redis, ConnectionPool
from app.config import settings

pool = ConnectionPool.from_url(settings.redis_url, decode_responses=True, max_connections=50)

redis_client = Redis(connection_pool=pool)
