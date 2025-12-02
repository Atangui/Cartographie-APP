FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy entire application
COPY . .

# Run migrations and start server
CMD python manage.py migrate --noinput && \
    python manage.py init_event_types && \
    python manage.py init_demo_data && \
    python manage.py collectstatic --noinput && \
    gunicorn geoapp.wsgi --bind 0.0.0.0:$PORT --log-file - --access-logfile -
