FROM python:3.13-slim

# Install poetry
RUN pip install --no-cache-dir poetry

WORKDIR /app

# Copy project files
COPY pyproject.toml poetry.lock* ./

# Install Poetry and the export plugin
RUN pip install --no-cache-dir poetry poetry-plugin-export

# Export dependencies and install using pip (instead of poetry install)
RUN poetry export -f requirements.txt --output requirements.txt \
    && pip install --no-cache-dir -r requirements.txt

# Copy rest of the code 
COPY . .

EXPOSE 8001

CMD ["python", "-m", "uvicorn", "src.llm.main:bananaLlm", "--host", "0.0.0.0", "--port", "8001"]