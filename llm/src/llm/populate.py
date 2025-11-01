import hashlib
import re
import shutil
from pathlib import Path
import argparse

from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from llm.embeddings import get_model_embeddings
from llm.core.logger import logger

# ------------------- Paths ------------------- #
CHROMA_PATH = Path(__file__).parent.parent.parent / 'chroma'
MAIN_DATA_PATH = Path(__file__).parent.parent.parent / 'data' / 'main' / 'diseases.md'
OTHER_DATA_PATH = Path(__file__).parent.parent.parent / 'data' / 'other'


# ------------------- Clear Database ------------------- #
def clear_db():
    if CHROMA_PATH.exists():
        shutil.rmtree(CHROMA_PATH)
        logger.info("✨ Cleared Chroma database")


# ------------------- Document Splitter ------------------- #
def split_document_content(doc: Document, chunk_size=1200, chunk_overlap=100) -> list[Document]:
    """
    Split a single Document into chunks using RecursiveCharacterTextSplitter.
    Returns a list of Document chunks.
    """
    if len(doc.page_content) <= chunk_size:
        return [doc]

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        is_separator_regex=False
    )
    return splitter.split_documents([doc])


def split_documents(docs: list[Document], chunk_size=1200, chunk_overlap=100) -> list[Document]:
    """
    Split a list of Documents into chunks.
    """
    all_chunks = []
    for doc in docs:
        all_chunks.extend(split_document_content(doc, chunk_size, chunk_overlap))
    return all_chunks


# ------------------- Load Markdown ------------------- #
def load_main_documents(chunk_size=1200, chunk_overlap=100) -> list[Document]:
    """
    Load main Markdown file, one chunk per disease.
    Long sections are automatically split into sub-chunks.
    """
    with open(MAIN_DATA_PATH, encoding="utf-8") as f:
        content = f.read()

    # Split by top-level headings (##)
    sections = re.split(r"(## .*)", content)
    docs = []

    for i in range(1, len(sections), 2):
        heading = sections[i].strip()
        body = sections[i + 1].strip() if i + 1 < len(sections) else ""
        doc_content = f"{heading}\n{body}"
        doc = Document(page_content=doc_content, metadata={"source": str(MAIN_DATA_PATH)})

        # Split long disease sections
        docs.extend(split_document_content(doc, chunk_size, chunk_overlap))

    return docs


# ------------------- Load PDFs ------------------- #
def load_other_documents(chunk_size=800, chunk_overlap=80) -> list[Document]:
    """Load PDF documents and split them."""
    loader = PyPDFDirectoryLoader(OTHER_DATA_PATH)
    docs = loader.load()
    return split_documents(docs, chunk_size, chunk_overlap)


# ------------------- Hashes & IDs ------------------- #
def add_hashes(chunks: list[Document]) -> list[Document]:
    """Add SHA256 hash and unique ID for each chunk."""
    for i, chunk in enumerate(chunks):
        source = chunk.metadata.get("source", "unknown")
        page = chunk.metadata.get("page", 0)
        content_to_hash = f"{chunk.page_content}{source}{page}"
        chunk_hash = hashlib.sha256(content_to_hash.encode("utf-8")).hexdigest()
        chunk.metadata["hash"] = chunk_hash
        # Unique ID = source:path + page + index
        chunk.metadata["id"] = f"{source}:{page}:{i}"
    return chunks


# ------------------- Update Chroma ------------------- #
def update_chroma(chunks: list[Document]):
    """
    Add or update chunks in Chroma using hashes.
    Works with langchain_chroma's get() limitations.
    """
    db = Chroma(
        persist_directory=CHROMA_PATH.as_posix(),
        embedding_function=get_model_embeddings()
    )

    # Fetch existing documents and metadata
    existing_items = db.get(include=["documents", "metadatas"])
    existing_by_id = {
        md["id"]: md
        for md in existing_items["metadatas"]
    }

    to_add = []
    to_update = []

    for chunk in chunks:
        chunk_id = chunk.metadata["id"]
        chunk_hash = chunk.metadata["hash"]

        if chunk_id not in existing_by_id:
            to_add.append(chunk)
        elif existing_by_id[chunk_id].get("hash") != chunk_hash:
            to_update.append(chunk)

    # Add new chunks
    if to_add:
        logger.info(f"👉 Adding {len(to_add)} new chunks")
        db.add_documents(to_add, ids=[c.metadata["id"] for c in to_add])

    # Update changed chunks
    if to_update:
        logger.info(f"🔄 Updating {len(to_update)} changed chunks")
        db.update_documents(
            ids=[c.metadata["id"] for c in to_update],
            documents=to_update
        )

    logger.info("✅ Chroma database is up-to-date")

# ------------------- Main Workflow ------------------- #
def main(reset: bool = False):
    if reset:
        clear_db()

    # Load Markdown and PDFs
    main_chunks = load_main_documents()
    pdf_chunks = load_other_documents()
    all_chunks = main_chunks + pdf_chunks

    # Add hashes & IDs
    all_chunks = add_hashes(all_chunks)

    # plogger.info(all_chunks, indent=4)

    # Update Chroma
    update_chroma(all_chunks)


# ------------------- Entry Point ------------------- #
if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--reset", action="store_true", help="Reset database")
    args = parser.parse_args()
    main(reset=args.reset)