from pydantic import BaseModel
from llm.enums.disease_percentage import DiseaseType

class AskRequest(BaseModel):
    question: str
    retrieve_sources: bool = False

class InsightRequest(AskRequest):
    bbtv: float
    cordana: float
    panama: float
    healthy: float
    pestalotiopsis: float
    sigatoka: float
