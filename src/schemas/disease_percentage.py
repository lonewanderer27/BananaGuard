from pydantic import BaseModel, RootModel
from typing import Dict

from src.enums.disease_type import DiseaseType


class DiseasePercentageMap(BaseModel):
    RootModel: Dict[DiseaseType, int]