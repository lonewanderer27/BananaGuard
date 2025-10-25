from pydantic import BaseModel, Field


class InsightResponse(BaseModel):
    conversation_id: str = Field(
        ...,
        examples=["86Rf07"]
    )
    answer: str = Field(
        ...,
        examples=[
            (
                "BBTV (Banana Bunchy Top Virus) causes plants to grow upright with "
                "narrow, brittle leaves and reduced fruit production. There is no cure, "
                "but infected plants should be destroyed and removed to prevent spread. "
                "Control banana aphids, which transmit the virus, and plant only certified "
                "virus-free seedlings."
            )
        ]
    )
