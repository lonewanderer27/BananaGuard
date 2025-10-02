from typing import Dict, Optional

from pydantic import BaseModel

from src.enums.disease_type import DiseaseType


class InsightRequest(BaseModel):
    analysis: Dict[DiseaseType, int]
    inquiry: Optional[str] = None
    conversation_id: Optional[str] = None