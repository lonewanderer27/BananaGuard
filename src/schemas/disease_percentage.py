from pydantic import BaseModel, RootModel
from typing import Dict

from src.enums.disease_type import DiseaseType


class DiseasePercentageMap(RootModel[Dict[DiseaseType, int]]):
    class Config:
        json_schema_extra = {
            "example": {
                DiseaseType.BlackSigatoka.value: 80,
                DiseaseType.BBTV.value: 60,
                DiseaseType.Panama.value: 30,
            }
        }