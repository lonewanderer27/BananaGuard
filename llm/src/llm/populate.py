from pathlib import Path
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

CHROMA_PATH = Path(__file__).parent.parent.parent / 'chroma'
MAIN_DATA_PATH = Path(__file__).parent.parent.parent / 'data' / 'main' / 'diseases.md'
OTHER_DATA_PATH = Path(__file__).parent.parent.parent / 'data' / 'other'

def clear_db():
    pass

def load_main_documents() -> list[Document]:
    """Load the main markdown file as a Document."""
    with open(MAIN_DATA_PATH, encoding="utf-8") as f:
        content = f.read()
    return [Document(page_content=content, metadata={"source": str(MAIN_DATA_PATH)})]

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

def calculate_chunk_ids(chunks: list[Document]) -> list[Document]:
    """Assign unique IDs to each chunk based on source, page, and index."""
    last_page_id = None
    current_chunk_index = 0

    for chunk in chunks:
        source = chunk.metadata.get("source", "unknown")
        page = chunk.metadata.get("page", 0)
        current_page_id = f"{source}:{page}"

        if current_page_id == last_page_id:
            current_chunk_index += 1
        else:
            current_chunk_index = 0

        chunk_id = f"{current_page_id}:{current_chunk_index}"
        chunk.metadata["id"] = chunk_id
        last_page_id = current_page_id

    return chunks

def insert_to_chroma(chunks: list[Document]):
    pass

def main():
    content = load_main_documents()
    print(content)

if __name__ == "__main__":
    main()