import argparse
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.llms.ollama import Ollama

from llm.embeddings import get_ollama_embeddings
from llm.populate import CHROMA_PATH

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""


def load_db():
    """Load Chroma DB with embeddings."""
    embedding_function = get_ollama_embeddings()
    db = Chroma(persist_directory=CHROMA_PATH.as_posix(), embedding_function=embedding_function)
    return db


def retrieve_context(db, query_text: str, k: int = 5):
    """Retrieve top-k most similar chunks from Chroma."""
    results = db.similarity_search_with_score(query_text, k=k)
    if not results:
        return "", []

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _ in results])
    sources = [
        f"{doc.metadata.get('source')} (id={doc.metadata.get('id')})"
        for doc, _ in results
    ]
    return context_text, sources


def generate_response(query_text: str, context_text: str, model_name: str = "gemma3:1b"):
    """Generate response using Ollama LLM."""
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)
    model = Ollama(model=model_name)
    response_text = model.invoke(prompt)
    return response_text


def query_rag(query_text: str, k: int = 5, model_name: str = "gemma3:1b"):
    db = load_db()
    context_text, sources = retrieve_context(db, query_text, k=k)

    if not context_text:
        print("No relevant information found in the database.")
        return ""

    response_text = generate_response(query_text, context_text, model_name=model_name)
    formatted_response = f"Response:\n{response_text}\n\nSources:\n" + "\n".join(sources)
    print(formatted_response)
    return response_text


def main():
    parser = argparse.ArgumentParser(description="Query your RAG system")
    parser.add_argument("query_text", type=str, help="The query text.")
    parser.add_argument("--k", type=int, default=5, help="Number of chunks to retrieve")
    parser.add_argument("--model", type=str, default="gemma3:1b", help="Ollama model name")
    args = parser.parse_args()

    query_rag(args.query_text, k=args.k, model_name=args.model)


if __name__ == "__main__":
    main()