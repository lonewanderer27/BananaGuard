import uvicorn
from fastapi import FastAPI

bananaAPI = FastAPI(title="Banana API", version="0.1")

@bananaAPI.get('/')
async def index():
    return "Welcome to BananaGuard API. Please visit the documentation at /docs for more information."

if __name__ == "__main__":
    uvicorn.run(bananaAPI, host="0.0.0.0", port=8000)