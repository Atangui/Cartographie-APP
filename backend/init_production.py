#!/usr/bin/env python
"""
Script to initialize production database with demo data
Run this once after deployment to Koyeb
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geoapp.settings_prod')
django.setup()

from django.core.management import call_command

print("🚀 Initializing production database...")
print("=" * 50)

try:
    print("\n1️⃣ Running migrations...")
    call_command('migrate', '--noinput')
    print("✅ Migrations complete")
    
    print("\n2️⃣ Creating event types...")
    call_command('init_event_types')
    print("✅ Event types created")
    
    print("\n3️⃣ Creating demo data...")
    call_command('init_demo_data')
    print("✅ Demo data created")
    
    print("\n4️⃣ Collecting static files...")
    call_command('collectstatic', '--noinput')
    print("✅ Static files collected")
    
    print("\n" + "=" * 50)
    print("🎉 Production database initialized successfully!")
    print("\nYour application is ready at:")
    print("https://voluminous-bernadine-catangui-d74f504e.koyeb.app/api/")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
