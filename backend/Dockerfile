FROM python:3.11-slim

# Install poetry
RUN pip install --no-cache-dir poetry

WORKDIR /app

# Copy project files
COPY pyproject.toml poetry.lock* ./

# Install dependencies
RUN poetry install --no-interaction --without dev

COPY ./src ./src
COPY ../model ./model

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.main:bananaAPI", "--host", "0.0.0.0", "--port", "8000"]