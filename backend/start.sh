#!/bin/bash

# Run migrations
python manage.py migrate --noinput

# Initialize event types
python manage.py init_event_types

# Initialize demo data
python manage.py init_demo_data

# Start Gunicorn
gunicorn geoapp.wsgi --log-file -
