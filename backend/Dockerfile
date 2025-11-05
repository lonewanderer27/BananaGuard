FROM python:3.11-slim

# Install poetry and export plugin
RUN pip install --no-cache-dir poetry poetry-plugin-export

WORKDIR /app

# Copy project files
COPY pyproject.toml poetry.lock* ./

# Export dependencies and install using pip (instead of poetry install)
RUN poetry export -f requirements.txt --without dev --output requirements.txt \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY ./src ./src

EXPOSE 8000

# Make sure Python can find `src/` as a module root
ENV PYTHONPATH="/app/src"

CMD ["poetry", "run", "uvicorn", "src.backend.main:bananaAPI", "--host", "0.0.0.0", "--port", "8000"]