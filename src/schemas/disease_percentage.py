from pydantic import BaseModel
from typing import Dict

from src.enums.disease_type import DiseaseType


class DiseasePercentageMap(BaseModel):
    __root__: Dict[DiseaseType, int]