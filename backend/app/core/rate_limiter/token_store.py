import json

from app.core.rate_limiter.token_bucket import TokenBucket
from app.core.redis import redis_client

MAX_TOKENS = 30
REFILL_RATE = 4
REFILL_INTERVAL = 1

async def create_bucket(ip_address: str):
    bucket = TokenBucket(max_tokens=MAX_TOKENS, refill_rate=REFILL_RATE, refill_interval=REFILL_INTERVAL)

    await redis_client.set(f"token_bucket:{ip_address}", json.dumps(bucket.to_dict()))