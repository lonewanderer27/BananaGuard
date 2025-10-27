from fastapi import APIRouter, Query, Request
from llm.query import load_db, retrieve_context, generate_response
from llm.schemas.rag_response import RagResponse

ask_route = APIRouter(
    prefix="/ask",
    tags=["Ask"]
)

@ask_route.get('/', response_model=RagResponse)
def ask(request: Request, question: str = Query(..., description="User query text"),
              retrieve_sources: bool = False):
    # load chroma db
    db = request.app.state.db

    # retrieve relevant texts from the source materials
    context_text, sources = retrieve_context(db, question)

    # generate a response given the context
    response_text = generate_response(question, context_text)

    if retrieve_sources:
        return RagResponse(sources=sources,response=response_text)
    else:
        return RagResponse(response=response_text)
