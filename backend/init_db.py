#!/usr/bin/env python
"""
Script pour initialiser la base de données en production
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geoapp.settings_prod')
django.setup()

from django.core.management import call_command

print("🔄 Running migrations...")
call_command('migrate')

print("📊 Creating event types...")
call_command('init_event_types')

print("🎲 Creating demo data...")
call_command('init_demo_data')

print("✅ Database initialized successfully!")
