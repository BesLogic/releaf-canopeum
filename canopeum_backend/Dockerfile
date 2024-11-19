FROM python:3.12.2
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY 'pyproject.toml' /app/
COPY 'uv.lock' /app/

RUN uv sync --locked --no-dev

COPY . /app/

EXPOSE 5001

RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]
