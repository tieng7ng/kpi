from sqlalchemy import create_engine, text
import os

# Path to DB
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "kpi.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

print(f"Connecting to: {DATABASE_URL}")

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("\n--- Summary of UnifiedKPI ---")
    
    # Total count
    result = conn.execute(text("SELECT COUNT(*) FROM unified_kpi")).scalar()
    print(f"Total Rows: {result}")

    # Unique Dates
    print("\n--- Distinct Dates Present ---")
    result = conn.execute(text("SELECT DISTINCT date FROM unified_kpi ORDER BY date")).fetchall()
    for row in result:
        print(row[0])

    # Sample Data
    print("\n--- First 5 Rows ---")
    result = conn.execute(text("SELECT date, kpi_name, category, value FROM unified_kpi LIMIT 5")).fetchall()
    for row in result:
        print(row)
