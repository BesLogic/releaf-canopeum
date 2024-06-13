FROM python:3.12.2

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY 'requirements.txt' /app/

RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 5001
CMD ["python", "manage.py", "runserver", "0.0.0.0:5001"]
