from pydantic import BaseModel, Field
from llm.enums.disease_percentage import DiseaseType
from typing import Dict

class AskRequest(BaseModel):
    question: str
    retrieve_sources: bool = False

class InsightRequest(AskRequest):
    analysis_result: Dict[DiseaseType, float] = Field(
        default=None,
        examples=[{
            DiseaseType.BBTV.value: 80,
            DiseaseType.Cordana.value: 60,
            DiseaseType.Panama.value: 30,
            DiseaseType.Healthy.value: 17,
            DiseaseType.Pestalotiopsis.value: 10,
            DiseaseType.BlackSigatoka.value: 3
        }]
    )