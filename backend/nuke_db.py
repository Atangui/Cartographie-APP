import os
import sys
import django
from django.db import connection

def nuke_db():
    # Set up Django environment
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geoapp.settings_prod')
    try:
        django.setup()
    except Exception as e:
        print(f"Error setting up Django: {e}")
        return

    print("☢️  NUCLEAR OPTION: DROPPING ALL TABLES ☢️")
    with connection.cursor() as cursor:
        cursor.execute("""
            DO $$ DECLARE
                r RECORD;
            BEGIN
                FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                    EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
                END LOOP;
            END $$;
        """)
    print("✅ All tables dropped. Database is clean.")

if __name__ == "__main__":
    nuke_db()
