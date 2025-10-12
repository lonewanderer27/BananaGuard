FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-root

COPY ./src ./src
COPY ../model ./model

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "src.main:bananaAPI", "--host", "0.0.0.0"]