from app.core.redis import redis_client

BUCKET_SIZE = 20
REFILL_RATE = 4
REFILL_INTERVAL = 1

async def create_token_bucket(ip_address: str):
    pass

async def consume_token(ip_address: str, cost: int = 1):
    pass