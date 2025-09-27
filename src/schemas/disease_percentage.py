from pydantic import BaseModel, RootModel
from typing import Dict

from src.enums.disease_type import DiseaseType


class DiseasePercentageMap(RootModel[Dict[DiseaseType, int]]):
    pass