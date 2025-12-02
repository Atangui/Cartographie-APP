import os
import subprocess
import sys

def run_command(command):
    print(f"Running: {command}")
    try:
        subprocess.check_call(command, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        # We don't exit here because we want to try to start the server anyway
        # But for migrations it's critical.
        if "migrate" in command:
             print("Migration failed, but attempting to continue...")

def main():
    # Change to the directory of the script (backend/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    print(f"Working directory: {os.getcwd()}")
    
    python_exe = sys.executable
    print(f"Python executable: {python_exe}")
    
    # Run migrations
    run_command(f"{python_exe} manage.py migrate --noinput")
    
    # Run init scripts
    run_command(f"{python_exe} manage.py init_event_types")
    run_command(f"{python_exe} manage.py init_demo_data")
    
    # Start Gunicorn
    print("Starting Gunicorn...")
    # We replace the current process with gunicorn
    # This ensures signals are passed correctly
    os.execl(python_exe, python_exe, "-m", "gunicorn", "geoapp.wsgi", "--log-file", "-")

if __name__ == "__main__":
    main()
