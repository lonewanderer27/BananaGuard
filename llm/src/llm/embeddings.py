from langchain_ollama import OllamaEmbeddings

def get_model_embeddings():
    embeddings = OllamaEmbeddings(model='nomic-embed-text')
    return embeddings