FROM --platform=linux/arm64 python:3.12.2

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY 'requirements.txt' /app/

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 5001

RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]
