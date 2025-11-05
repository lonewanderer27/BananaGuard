import os
from pathlib import Path
from langchain_ollama import OllamaEmbeddings

def running_in_container() -> bool:
    try:
        if Path("/.dockerenv").exists():
            return True
        with open("/proc/1/cgroup", "rt") as f:
            return any("docker" in line or "kubepods" in line for line in f)
    except Exception:
        return False

OLLAMA_URL = os.getenv("OLLAMA_URL") or (
    "http://host.docker.internal:11434" if running_in_container() else "http://localhost:11434"
)

def get_model_embeddings():
    embeddings = OllamaEmbeddings(
        model='nomic-embed-text',
        base_url=OLLAMA_URL
    )
    return embeddings