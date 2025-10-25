FROM python:3.13-slim

# Install poetry
RUN pip install --no-cache-dir poetry

WORKDIR /app

# Copy project files
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry install --no-interaction --without dev

# Copy rest of the code 
COPY . .

EXPOSE 8001

CMD ["poetry", "run", "uvicorn", "src.llm.main:bananaLlm", "--host", "0.0.0.0", "--port", "8001"]