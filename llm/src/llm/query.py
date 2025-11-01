import argparse
from pathlib import Path
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM  # Updated class
from llm.embeddings import get_model_embeddings
from llm.populate import CHROMA_PATH
from llm.core.logger import logger
from llm.templates.template_types import TemplateTypes
from llm.templates.prompt_builder import prompt_builder
from typing import Optional

def load_db() -> Chroma:
    """Load Chroma DB with embeddings."""
    try:
        logger.info("Loading Chroma DB...")
        embedding_function = get_model_embeddings()
        db = Chroma(
            persist_directory=CHROMA_PATH.as_posix(),
            embedding_function=embedding_function
        )
        logger.info("DB loaded successfully")
        return db
    except Exception as e:
        logger.exception(f'Error loading Chroma DB {e}')
        raise


def retrieve_context(db: Chroma, query_text: str, k: int = 5):
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


def generate_response(query_text: str, context_text: str, type: TemplateTypes, analysis: Optional[dict[str, int]] = None, model_name: str = "gemma3:1b"):
    """Generate response using Ollama LLM."""
    prompt_template = ChatPromptTemplate.from_template(prompt_builder(type, context_text, query_text, analysis))
    prompt = prompt_template.format(context=context_text, question=query_text)

    model = OllamaLLM(model=model_name)
    response_text = model.invoke(prompt)
    return response_text


def query_rag(query_text: str, k: int = 5, model_name: str = "gemma3:1b", show_sources: bool = True):
    db = load_db()
    context_text, sources = retrieve_context(db, query_text, k=k)

    if not context_text:
        logger.info("No relevant information found in the database.")
        return ""

    response_text = generate_response(query_text, context_text, model_name=model_name)

    if show_sources:
        formatted_response = f"Response:\n{response_text}\n\nSources:\n" + "\n".join(sources)
    else:
        formatted_response = f"Response:\n{response_text}"

    logger.info(formatted_response)
    return response_text


def main():
    parser = argparse.ArgumentParser(description="Query your RAG system")
    parser.add_argument("query_text", type=str, help="The query text.")
    parser.add_argument("--k", type=int, default=5, help="Number of chunks to retrieve")
    parser.add_argument("--model", type=str, default="gemma3:1b", help="Ollama model name")
    parser.add_argument("--no-sources", action="store_true", help="Do not display source IDs")
    args = parser.parse_args()

    query_rag(
        args.query_text,
        k=args.k,
        model_name=args.model,
        show_sources=not args.no_sources
    )


if __name__ == "__main__":
    main()