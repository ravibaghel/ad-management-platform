FROM python:3.12-slim

WORKDIR /app

RUN addgroup --system adtech && adduser --system --group adtech

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ app/

RUN chown -R adtech:adtech /app
USER adtech

EXPOSE 8081
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8081"]
