import sys
import os

# Add the backend directory to sys.path so that 'app' can be imported as a top-level package
# This is necessary because the backend code uses 'from app...' imports
sys.path.append(os.path.join(os.path.dirname(__file__), '../backend'))

from app.main import app
