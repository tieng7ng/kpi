import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

import sys

# Ensure data directory exists
if getattr(sys, 'frozen', False):
    # PyInstaller Bundle logic
    if sys.platform == 'win32':
        # On Windows, use APPDATA to ensure persistence (even for portable apps)
        BASE_DIR = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'KPI_Analyzer')
    else:
        # Mac/Linux - Use executable directory or standard paths
        BASE_DIR = os.path.join(os.path.dirname(sys.executable), 'data')
else:
    # Development - Use source directory
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR = os.path.join(BASE_DIR, "data") if sys.platform != 'win32' or not getattr(sys, 'frozen', False) else BASE_DIR
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'kpi.db')}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
