from fastapi import APIRouter

from src.core.logger import logger
from src.schemas.insight_request import InsightRequest
from src.schemas.insight_response import InsightResponse

route = APIRouter(
    prefix="/insights",
    tags=["Insights"]
)

@route.post(path="/", response_model=InsightResponse)
async def insights(payload: InsightRequest):
    logger.info(f"Received payload: {str(payload)}")

    return InsightResponse(
        conversation_id=payload.conversation_id,
        answer=(
                "BBTV (Banana Bunchy Top Virus) causes plants to grow upright with "
                "narrow, brittle leaves and reduced fruit production. There is no cure, "
                "but infected plants should be destroyed and removed to prevent spread. "
                "Control banana aphids, which transmit the virus, and plant only certified "
                "virus-free seedlings."
            )
    )