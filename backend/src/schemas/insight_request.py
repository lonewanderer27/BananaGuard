from typing import Dict, Optional

from pydantic import BaseModel, Field

from src.enums.disease_type import DiseaseType


class InsightRequest(BaseModel):
    analysis: Dict[DiseaseType, int] = Field(
        examples=[
            {
                DiseaseType.BlackSigatoka.value: 80,
                DiseaseType.BBTV.value: 60,
                DiseaseType.Panama.value: 30
            }
        ]
    )
    inquiry: Optional[str] = Field(
        None,
        examples=["Tell me more about this disease and how can it be treated?"]
    )
    conversation_id: Optional[str] = Field(
        None,
        examples=["86Rf07"]
    )
