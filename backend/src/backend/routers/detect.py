from fastapi import APIRouter, UploadFile, HTTPException

from backend.core.constants import ALLOWED_MIMETYPES
from backend.core.logger import logger
from backend.enums.disease_type import DiseaseType
from backend.schemas.disease_percentage import DiseasePercentageMap

route = APIRouter(
    prefix="/detect",
    tags=["Detect"]
)

@route.post(
    path="/",
    description="Accepts an image file and returns the findings about the Banana",
    response_model=DiseasePercentageMap)
async def detect(photo: UploadFile):
    logger.info(f"Received: {photo.filename}")

    # cancel the operation if uploaded photo is not in compatible types.
    if photo.content_type not in ALLOWED_MIMETYPES:
        logger.error(f"Unsupported content type: {photo.content_type}")
        raise HTTPException(
            status_code=415,
            detail=f"Invalid filetype. The only allowed filetypes are {', '.join(ALLOWED_MIMETYPES)}.")

    return {
        DiseaseType.BlackSigatoka: 85,
        DiseaseType.BBTV: 60,
        DiseaseType.Panama: 40,
    }