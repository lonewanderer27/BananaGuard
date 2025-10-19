from langchain_ollama import OllamaLLM

def get_ollama_embeddings():
    embeddings = OllamaLLM(model='nomic-embed-text')
    return embeddings