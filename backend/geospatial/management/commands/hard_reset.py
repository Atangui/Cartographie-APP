from django.core.management.base import BaseCommand
from django.db import connection
from django.core.management import call_command

class Command(BaseCommand):
    help = 'Hard reset of the database'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('☢️  INITIATING HARD RESET ☢️'))
        
        # Drop all tables
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
        self.stdout.write(self.style.SUCCESS('✅ All tables dropped.'))

        # Migrate
        self.stdout.write('Applying migrations...')
        call_command('migrate', interactive=False)
        
        # Init data
        self.stdout.write('Initializing data...')
        call_command('init_event_types')
        call_command('init_demo_data')
        
        self.stdout.write(self.style.SUCCESS('✅ Hard reset complete.'))
