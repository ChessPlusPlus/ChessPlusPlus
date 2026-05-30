from app.schemas.base_schema import BaseSchema

class NormaliseJSONRequest(BaseSchema):
	simple_json: dict

class NormaliseJSONResponse(BaseSchema):
	normalised_json: dict