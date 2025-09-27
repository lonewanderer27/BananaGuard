from fastapi import APIRouter, UploadFile

from src.enums.disease_type import DiseaseType
from src.schemas.disease_percentage import DiseasePercentageMap

route = APIRouter(
    prefix="/detect",
    tags=["Detect"]
)

@route.post(
    path="/",
    description="Accepts an image file and returns the findings about the Banana",
    response_model=DiseasePercentageMap)
async def detect():
    return {
        DiseaseType.BBTV.value: 0,
        DiseaseType.Panama.value: 0,
        DiseaseType.BlackSigatoka.value: 0
    }