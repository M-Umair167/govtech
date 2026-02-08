
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Default to the config values or sensible defaults
DB_HOST = "localhost"
DB_USER = "postgres"
DB_PASSWORD = "password" # Trying 'password' first as per original config, then 'admin'
DB_NAME = "govtech_db"

def create_database():
    # Try connecting with 'admin' first as seen in .env
    try:
        con = psycopg2.connect(dbname='postgres', user=DB_USER, host=DB_HOST, password='admin')
    except psycopg2.OperationalError:
        try:
             # Fallback to 'password'
             con = psycopg2.connect(dbname='postgres', user=DB_USER, host=DB_HOST, password='password')
        except Exception as e:
            print(f"could not connect to postgres: {e}")
            return

    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    
    # Check if db exists
    cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{DB_NAME}'")
    exists = cur.fetchone()
    
    if not exists:
        print(f"Creating database {DB_NAME}...")
        cur.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"Database {DB_NAME} created successfully.")
    else:
        print(f"Database {DB_NAME} already exists.")
    
    cur.close()
    con.close()

if __name__ == "__main__":
    create_database()
