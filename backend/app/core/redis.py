from redis import Redis
from app.config import settings

redis_client = Redis(
    host=settings.redis_host,
    port=settings.redis_port,
    decode_responses=True,
)

