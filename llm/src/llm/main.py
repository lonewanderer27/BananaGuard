import uvicorn
from fastapi import FastAPI
from llm.routers.rag import rag_route
from llm.query import load_db
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    db = load_db()

    # Store db instance to global state
    app.state.db = db

    # Continue execution
    yield

bananaLlm = FastAPI(title="BananaGuard LLM", version="0.1", lifespan=lifespan)
bananaLlm.include_router(rag_route)

@bananaLlm.get('/')
async def index():
    return "Welcome to BananaGuard LLM. Please visit the documentation at /docs for more information."

if __name__ == "__main__":
    uvicorn.run(bananaLlm, host="0.0.0.0", port=8001)