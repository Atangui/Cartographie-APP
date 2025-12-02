FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Run migrations and start server
CMD python manage.py migrate && \
    python manage.py init_event_types && \
    python manage.py init_demo_data && \
    gunicorn geoapp.wsgi --bind 0.0.0.0:$PORT --log-file -
