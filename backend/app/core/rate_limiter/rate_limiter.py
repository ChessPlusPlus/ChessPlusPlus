from app.core.redis import redis_client
from pathlib import Path

BUCKET_SIZE = 20
REFILL_AMOUNT = 4
REFILL_INTERVAL = 1

script_path = Path(__file__).with_name("rate_limiter.lua")
script_content = script_path.read_text()

run_consume_token_script = redis_client.register_script(script_content)

async def consume_token(ip_address: str, bucket_size: int = BUCKET_SIZE, refill_rate: int = REFILL_AMOUNT, refill_interval: int = REFILL_INTERVAL, token_cost: int = 1):
    current_time = time.time()
    result = await run_consume_token_script(keys=[f"token_bucket:{ip_address}"], args=[bucket_size, refill_rate, refill_interval, token_cost, current_time])
    reset_time = result[3]

    return {
        "success": result[0],
        "bucket_size": result[1],
        "remaining_tokens": result[2],
        "retry_after": max(1, reset_time - current_time),
        "reset_time": reset_time
    }