import uvicorn
from fastapi import FastAPI
from llm.routers.rag import rag_route

bananaLlm = FastAPI(title="BananaGuard LLM", version="0.1")
bananaLlm.include_router(rag_route)

if __name__ == "__main__":
    uvicorn.run(bananaLlm, host="0.0.0.0", port=8003)