from pydantic import RootModel, ConfigDict
from typing import Dict

from backend.enums.disease_type import DiseaseType


class DiseasePercentageMap(RootModel[Dict[DiseaseType, float]]):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                DiseaseType.BBTV.value: 80,
                DiseaseType.Cordana.value: 60,
                DiseaseType.Panama.value: 30,
                DiseaseType.Healthy.value: 17,
                DiseaseType.Pestalotiopsis.value: 10,
                DiseaseType.BlackSigatoka.value: 3
            }
        }
    )