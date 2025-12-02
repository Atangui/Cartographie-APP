import os
import sys
import django
from django.db import connection
from django.core.management import call_command

def fix_database():
    # Set up Django environment
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geoapp.settings_prod')
    try:
        django.setup()
    except Exception as e:
        print(f"Error setting up Django: {e}")
        return

    print("Checking database consistency...")
    try:
        # Check if the table exists using introspection (DB-agnostic)
        all_tables = connection.introspection.table_names()
        table_name = 'geospatial_geozone'
        
        if table_name in all_tables:
            print(f"✅ Table '{table_name}' exists. Database seems healthy.")
        else:
            print(f"❌ Table '{table_name}' is MISSING.")
            print("   Checking if migrations think it should exist...")
            
            # Check migration recorder
            from django.db.migrations.recorder import MigrationRecorder
            recorder = MigrationRecorder(connection)
            try:
                applied_migrations = recorder.applied_migrations()
                if ('geospatial', '0001_initial') in applied_migrations:
                    print("   ⚠️ Migration '0001_initial' is marked as APPLIED, but table is missing.")
                    print("   🛠️  FIXING: Resetting migration history for 'geospatial' app...")
                    
                    # Fake unapply to clear the history for this app
                    call_command('migrate', 'geospatial', 'zero', fake=True)
                    print("   ✅ History reset. The next 'migrate' command will recreate the tables.")
                else:
                    print("   ℹ️  Migration '0001_initial' is NOT applied. Normal migration should work.")
            except Exception as e:
                print(f"   Warning: Could not check migration history: {e}")
                # If we can't check history, maybe the django_migrations table is broken too?
                # Let's try to force a reset anyway if the table is missing
                print("   ⚠️ Force resetting migration history for geospatial app just in case...")
                try:
                    call_command('migrate', 'geospatial', 'zero', fake=True)
                except:
                    pass

    except Exception as e:
        print(f"Error during DB check: {e}")
        # Don't exit with error, let the main process try its best
        pass

if __name__ == "__main__":
    fix_database()
