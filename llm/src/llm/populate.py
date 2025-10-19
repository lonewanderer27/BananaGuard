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

def update_chroma(chunks: list[Document]):
    db = Chroma(persist_directory=CHROMA_PATH.as_posix(), embedding_function=get_ollama_embeddings())

    # Fetch existing records
    existing_items = db.get(include=["metadata"])
    existing_by_id = {item["id"]: item for item in existing_items.get("documents", [])}

    to_add = []
    to_update = []

    for chunk in chunks:
        chunk_id = chunk.metadata["id"]
        chunk_hash = chunk.metadata["hash"]

        if chunk_id not in existing_by_id:
            to_add.append(chunk)
        elif existing_by_id[chunk_id]["metadata"].get("hash") != chunk_hash:
            to_update.append(chunk)

    # Add new chunks
    if to_add:
        print(f"👉 Adding {len(to_add)} new chunks")
        db.add_documents(to_add, ids=[c.metadata["id"] for c in to_add])

    # Update changed chunks
    if to_update:
        print(f"🔄 Updating {len(to_update)} changed chunks")
        for chunk in to_update:
            db.update_documents(
                ids=[chunk.metadata["id"] for chunk in to_update],
                documents=to_update
            )

    print("✅ Update complete")

def main():
    # Load documents
    main_docs = load_main_documents()
    other_docs = load_other_documents()
    all_docs = main_docs + other_docs

    # Split into chunks
    chunks = split_documents(all_docs)

    # Add hashes and IDs
    chunks = add_hashes(chunks)

    # Update Chroma DB
    update_chroma(chunks)

if __name__ == "__main__":
    main()