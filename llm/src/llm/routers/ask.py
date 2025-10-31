from fastapi import APIRouter, Query, Request
from llm.query import load_db, retrieve_context, generate_response
from llm.schemas.rag_response import RagResponse
from llm.templates.template_types import TemplateTypes
from pydantic import BaseModel

class AskRequest(BaseModel):
    question: str
    retrieve_sources: bool = False

ask_route = APIRouter(
    prefix="/ask",
    tags=["Ask"]
)

@ask_route.post('/', response_model=RagResponse)
def ask(request: Request, body: AskRequest):
    # load chroma db
    db = request.app.state.db

    # retrieve relevant texts from the source materials
    context_text, sources = retrieve_context(db, body.question)

    # generate a response given the context
    response_text = generate_response(body.question, context_text, TemplateTypes.GeneralInquiry)

    if body.retrieve_sources:
        return RagResponse(sources=sources,response=response_text)
    else:
        return RagResponse(response=response_text)
