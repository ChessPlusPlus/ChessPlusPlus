from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.middleware.rate_limiter import rate_limit_middleware
from app.schemas.base_schema import BaseSchema
from app.engine.json_validator.json_validator import validate_json

from app.api.routers import move_rules
from app.api.routers import game
from app.api.routers import json

app = FastAPI()

origins = ["http://localhost:5173", "https://chessplusplus.vercel.app", "https://chessplusplus-beta.vercel.app"]

app.middleware("http")(rate_limit_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(move_rules.router, prefix="/move-rules")
app.include_router(game.router, prefix="/game")
app.include_router(json.router, prefix="/json")

class JSONValidationRequest(BaseSchema):
    json_to_validate: dict

class JSONValidationResponse(BaseSchema):
    validation_status: tuple[bool, str]

@app.api_route("/test", methods=["GET", "POST"], status_code=200)
async def test_route():
    return {"message": "Hello, World!"}

@app.post("/json-validator-test", response_model=JSONValidationResponse)
async def json_validator_test(validation_request: JSONValidationRequest):
    validation_status = validate_json(validation_request.json_to_validate)

    return {"validation_status": validation_status}