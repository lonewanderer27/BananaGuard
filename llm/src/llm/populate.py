import hashlib
import re
from pathlib import Path

from chromadb.errors import ChromaError
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from llm.embeddings import get_ollama_embeddings

CHROMA_PATH = Path(__file__).parent.parent.parent / 'chroma'
MAIN_DATA_PATH = Path(__file__).parent.parent.parent / 'data' / 'main' / 'diseases.md'
OTHER_DATA_PATH = Path(__file__).parent.parent.parent / 'data' / 'other'

def clear_db():
    pass

def load_main_documents() -> list[Document]:
    """Load the main markdown file as a Document."""
    with open(MAIN_DATA_PATH, encoding="utf-8") as f:
        content = f.read()

    sections = re.split(r"(## .*)", content)
    docs = []

    # Merge heading + content
    for i in range(1, len(sections), 2):
        heading = sections[i].strip()
        body = sections[i + 1].strip() if i + 1 < len(sections) else ""
        doc_content = f"{heading}\n{body}"
        docs.append(Document(page_content=doc_content, metadata={"source": str(MAIN_DATA_PATH)}))

    return docs

def load_other_documents() -> list[Document]:
    """Load other PDFs from a directory."""
    loader = PyPDFDirectoryLoader(OTHER_DATA_PATH)
    return loader.load()

def split_documents(documents: list[Document], chunk_size=800, chunk_overlap=80) -> list[Document]:
    """Split documents into chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        is_separator_regex=False,
    )
    return splitter.split_documents(documents)

def add_hashes(chunks: list[Document]) -> list[Document]:
    """Add a SHA256 hash for each chunk/section."""
    for i, chunk in enumerate(chunks):
        source = chunk.metadata.get("source", "unknown")
        page = chunk.metadata.get("page", 0)
        content_to_hash = f"{chunk.page_content}{source}{page}"
        chunk_hash = hashlib.sha256(content_to_hash.encode("utf-8")).hexdigest()
        chunk.metadata["hash"] = chunk_hash
        # Assign a temporary ID (can be replaced with final ID)
        chunk.metadata["id"] = f"{source}:{page}:{i}"
    return chunks

def insert_to_chroma(chunks: list[Document]):
    db = Chroma(persist_directory=CHROMA_PATH.as_posix(), embedding_function=get_ollama_embeddings())

    # Load existing items
    existing_items = db.get(include=["metadata"])
    existing_hashes = {item["metadata"]["hash"]: item["id"] for item in existing_items.get("documents", [])}

    # Filter new or changed chunks
    new_chunks = [chunk for chunk in chunks if chunk.metadata["hash"] not in existing_hashes]

    if new_chunks:
        print(f"👉 Adding {len(new_chunks)} new/updated chunks")
        db.add_documents(new_chunks, ids=[chunk.metadata["id"] for chunk in new_chunks])
    else:
        print("✅ No changes detected")

def main():
    content = load_main_documents()
    print(content)

if __name__ == "__main__":
    main()