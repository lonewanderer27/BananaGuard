import uvicorn
from fastapi import FastAPI
from backend.routers import detect
from backend.routers import insights
from backend.core.load_model import load_model
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_model()
    yield

bananaAPI = FastAPI(lifespan=lifespan, title="BananaGuard API", version="0.1")

@bananaAPI.get('/')
async def index():
    return "Welcome to BananaGuard API. Please visit the documentation at /docs for more information."

bananaAPI.include_router(detect.route)
bananaAPI.include_router(insights.route)

if __name__ == "__main__":
    uvicorn.run(bananaAPI, host="0.0.0.0", port=8000)