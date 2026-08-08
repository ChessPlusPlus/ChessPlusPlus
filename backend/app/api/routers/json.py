# from fastapi import APIRouter
# from app.schemas.normalise_json_request import NormaliseJSONRequest, NormaliseJSONResponse
# from app.engine.json_normaliser.json_normaliser import normalise_json as perform_json_normalisation
#
# router = APIRouter()
#
# @router.post("/normalise-json", response_model=NormaliseJSONResponse)
# async def normalise_json(request: NormaliseJSONRequest):
# 	simple_json = request.simple_json
# 	normalised_json = perform_json_normalisation(simple_json)
#
# 	return NormaliseJSONResponse(normalised_json=normalised_json)