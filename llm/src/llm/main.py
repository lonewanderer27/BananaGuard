import uvicorn
from fastapi import FastAPI
from llm.routers.rag import rag_route

bananaLlm = FastAPI(title="BananaGuard LLM", version="0.1")
bananaLlm.include_router(rag_route)

@bananaLlm.get('/')
async def index():
    return "Welcome to BananaGuard LLM. Please visit the documentation at /docs for more information."

if __name__ == "__main__":
    uvicorn.run(bananaLlm, host="0.0.0.0", port=8001)