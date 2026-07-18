from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.rate_limiter.rate_limiter import consume_token

async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host

    request_info = await consume_token(client_ip)
    if not request_info["success"]:
        return JSONResponse(
            status_code=429,
            content={"message": "Too many requests, please try again later."},
            headers={
                "Retry-After": str(request_info["retry_after"]),
                "X-RateLimit-Limit": str(request_info["bucket_size"]),
                "X-RateLimit-Remaining": str(request_info["remaining_tokens"]),
                "X-RateLimit-Reset": str(request_info["reset_time"]),
            }
        )

    response = await call_next(request)
    response.headers["X-RateLimit-Limit"] = str(request_info["bucket_size"])
    response.headers["X-RateLimit-Remaining"] = str(request_info["remaining_tokens"])
    response.headers["X-RateLimit-Reset"] = str(request_info["reset_time"])

    return response
