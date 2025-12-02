import os
import subprocess
import sys

def run_command(command, exit_on_error=True):
    print(f"Running: {command}")
    try:
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        if exit_on_error:
            print("CRITICAL ERROR: Command failed. Exiting.")
            sys.exit(1)
        else:
            print("Warning: Command failed but continuing...")

def main():
    # Change to the directory of the script (backend/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"Working directory: {os.getcwd()}")
    
    python_exe = sys.executable
    print(f"Python executable: {python_exe}")

    # Debug: List migration files
    print("Checking migration files:")
    migrations_dir = os.path.join(script_dir, 'geospatial', 'migrations')
    if os.path.exists(migrations_dir):
        for f in os.listdir(migrations_dir):
            print(f" - {f}")
    else:
        print(f"WARNING: Migrations directory not found at {migrations_dir}")

    # Debug: Show migrations status
    run_command(f"{python_exe} manage.py showmigrations", exit_on_error=False)
    
    # NUCLEAR OPTION: Drop everything if migration fails
    print("Attempting standard migration...")
    try:
        run_command(f"{python_exe} manage.py migrate --noinput", exit_on_error=True)
    except SystemExit:
        print("❌ Migration failed. Initiating NUCLEAR RESET protocol...")
        run_command(f"{python_exe} nuke_db.py", exit_on_error=False)
        print("♻️  Database wiped. Re-applying migrations from scratch...")
        run_command(f"{python_exe} manage.py migrate --noinput", exit_on_error=True)
    
    # Run init scripts
    run_command(f"{python_exe} manage.py init_event_types", exit_on_error=False)
    run_command(f"{python_exe} manage.py init_demo_data", exit_on_error=False)
    
    # Start Gunicorn
    print("Starting Gunicorn...")
    # We replace the current process with gunicorn
    # This ensures signals are passed correctly
    os.execl(python_exe, python_exe, "-m", "gunicorn", "geoapp.wsgi", "--log-file", "-")

if __name__ == "__main__":
    main()
