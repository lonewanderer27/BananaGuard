from pathlib import Path


def clear_db():
    pass

def load_main_documents() -> str:
    # Build the path to main doc reference file
    md_path = Path(__file__).parent.parent.parent / "data" / "main" / "diseases.md"

    # Read the file
    with open(md_path) as f:
        content = f.read()

    return content

def main():
    content = load_main_documents()
    print(content)

if __name__ == "__main__":
    main()