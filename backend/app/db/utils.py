from sqlalchemy_utils import database_exists, create_database
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

def ensure_db_exists():
    """
    Check if the database exists, if not create it.
    This function uses sqlalchemy-utils to create the database if it doesn't exist.
    It relies on the DATABASE_URL from settings.
    """
    try:
        if not database_exists(settings.DATABASE_URL):
            logger.info(f"Database {settings.DATABASE_URL} does not exist. Creating...")
            create_database(settings.DATABASE_URL)
            logger.info("Database created successfully.")
        else:
            logger.info("Database already exists.")
    except Exception as e:
        logger.error(f"Error ensuring database exists: {e}")
        # Depending on the error (e.g., operational error if postgres isn't running), 
        # we might want to re-raise or handle it. 
        # For now, let's log and re-raise so startup fails visibly if DB isn't reachable.
        raise e
