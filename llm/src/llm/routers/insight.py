from fastapi import APIRouter, Request
from llm.query import retrieve_context, generate_response
from llm.schemas.rag_response import RagResponse
from llm.schemas.rag_request import InsightRequest
from llm.templates.template_types import TemplateTypes

insight_route = APIRouter(
    prefix="/insight",
    tags=["Insight"]
)

@insight_route.post('/', response_model=RagResponse)
def insight(request: Request, body: InsightRequest):
    # load chroma db
    db = request.app.state.db

    # retrrieve relevant texts from the source materials
    context_text, sources = retrieve_context(db, body.question)

    # generate a response given the context
    response_text = generate_response(
        body.question, 
        context_text, 
        TemplateTypes.AnalysisInsight,
        analysis=body.analysis_result)

    if body.retrieve_sources:
        return RagResponse(sources=sources, response=response_text)
    else:
        return RagResponse(response=response_text)
