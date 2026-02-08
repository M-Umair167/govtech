
import sys
import os

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.utils import ensure_db_exists

if __name__ == "__main__":
    print("Checking database...")
    ensure_db_exists()
    print("Done.")
