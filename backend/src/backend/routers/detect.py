from fastapi import APIRouter, UploadFile, HTTPException, Request
from backend.core.constants import ALLOWED_MIMETYPES
from backend.core.logger import logger
from backend.services.predict_disease import predict_disease
from backend.schemas.disease_percentage import DiseasePercentageMap
from typing import Optional

route = APIRouter(
    prefix="/detect",
    tags=["Detect"]
)

@route.post(
    path="/",
    description="Accepts an image file and returns the findings about the Banana",
    response_model=DiseasePercentageMap)
async def detect(request: Request, photo: UploadFile, sort_results: Optional[bool] = False):
    logger.info(f"Received: {photo.filename}")

    # cancel the operation if uploaded photo is not in compatible types.
    if photo.content_type not in ALLOWED_MIMETYPES:
        logger.error(f"Unsupported content type: {photo.content_type}")
        raise HTTPException(
            status_code=415,
            detail=f"Invalid filetype. The only allowed filetypes are {', '.join(ALLOWED_MIMETYPES)}.")
    
    contents = await photo.read()
    
    model = request.app.state.model
    predictions, predicted_disease_type, confidence =  predict_disease(
        contents, model, sort_results=sort_results
    )
    logger.info(f'Result: {predicted_disease_type} [{confidence}%]')

    return DiseasePercentageMap(predictions)