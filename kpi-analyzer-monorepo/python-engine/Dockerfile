FROM python:3.11-slim

WORKDIR /app

# Configuration Locale/Encoding
ENV PYTHONIOENCODING=utf-8
ENV LANG=C.UTF-8


# Dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Code source
COPY . .

# Créer le dossier data
RUN mkdir -p /app/data

EXPOSE 8000

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
