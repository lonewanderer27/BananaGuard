from pydantic import RootModel, ConfigDict
from typing import Dict

from backend.enums.disease_type import DiseaseType


class DiseasePercentageMap(RootModel[Dict[DiseaseType, int]]):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                DiseaseType.BlackSigatoka.value: 80,
                DiseaseType.BBTV.value: 60,
                DiseaseType.Panama.value: 30,
                DiseaseType.Cordana.value: 17,
                DiseaseType.Pestalotiopsis.value: 10,
                DiseaseType.Healthy.value: 3
            }
        }
    )