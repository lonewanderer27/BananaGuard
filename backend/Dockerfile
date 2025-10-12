FROM python:3.12-slim

WORKDIR /app

# Prevent Poetry from creating virtualenvs inside the project (install into system site-packages)
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_VIRTUALENVS_IN_PROJECT=false

COPY pyproject.toml poetry.lock ./
# Install Poetry and project dependencies into the container environment so console scripts
# (uvicorn, etc.) are available on PATH even if the project directory is bind-mounted at runtime.
RUN pip install --no-cache-dir poetry && \
	poetry install --no-root --without dev

COPY ./src ./src
COPY ../model ./model

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.main:bananaAPI", "--host", "0.0.0.0"]