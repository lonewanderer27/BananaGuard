FROM python:3.11-slim

# Install poetry
RUN pip install --no-cache-dir poetry

WORKDIR /app

# Copy project files
COPY pyproject.toml poetry.lock* ./

# Install Poetry and the export plugin
RUN pip install --no-cache-dir poetry poetry-plugin-export

# Export dependencies and install using pip (instead of poetry install)
RUN poetry export -f requirements.txt --without dev --output requirements.txt \
    && pip install --no-cache-dir -r requirements.txt

COPY ./src ./src

EXPOSE 8000

ENV PYTHONPATH=/app
CMD ["poetry", "run", "uvicorn", "src.main:bananaAPI", "--host", "0.0.0.0", "--port", "8000"]