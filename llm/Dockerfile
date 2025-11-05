FROM python:3.13-slim

# Install poetry and export plugin
RUN pip install --no-cache-dir poetry poetry-plugin-export

WORKDIR /app

# Copy project files
COPY pyproject.toml poetry.lock* ./

# Export dependencies and install using pip (instead of poetry install)
RUN poetry export -f requirements.txt --output requirements.txt \
    && pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY . .

EXPOSE 8001

# Make sure Python can find `src/` as a module root
ENV PYTHONPATH="/app/src"

CMD ["python", "-m", "uvicorn", "src.llm.main:bananaLlm", "--host", "0.0.0.0", "--port", "8001"]