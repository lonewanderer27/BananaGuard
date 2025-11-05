import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import detect
from backend.services.load_model import load_model
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    model = load_model()

    # Store model to global state
    app.state.model =  model

    # Continue exection
    yield

bananaAPI = FastAPI(lifespan=lifespan, title="BananaGuard API", version="0.1")

bananaAPI.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@bananaAPI.get('/')
async def index():
    return "Welcome to BananaGuard API. Please visit the documentation at /docs for more information."

bananaAPI.include_router(detect.route)

if __name__ == "__main__":
    uvicorn.run(bananaAPI, host="0.0.0.0", port=8000)