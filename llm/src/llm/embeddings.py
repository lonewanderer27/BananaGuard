from langchain_ollama import OllamaEmbeddings

def get_ollama_embeddings():
    embeddings = OllamaEmbeddings(model='nomic-embed-text')
    return embeddings