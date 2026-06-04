from redis.asyncio import Redis

redis_client = Redis.from_url(settings.redis_url, decode_responses=True)