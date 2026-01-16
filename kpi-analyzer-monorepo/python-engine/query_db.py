import sys
from sqlalchemy import text
from database.connection import get_db

def run_query(sql_query):
    db = next(get_db())
    try:
        print(f"Executing: {sql_query}\n")
        result = db.execute(text(sql_query))
        
        # Check if query returns rows (SELECT)
        if result.returns_rows:
            rows = result.fetchall()
            if not rows:
                print("No results found.")
                return

            # Print headers
            keys = result.keys()
            print(" | ".join(keys))
            print("-" * (len(" | ".join(keys))))
            
            # Print rows
            for row in rows:
                print(" | ".join(str(val) for val in row))
        else:
            # For INSERT/UPDATE/DELETE, commit and print row count
            db.commit()
            print(f"Query executed. Rows affected: {result.rowcount}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python query_db.py \"SELECT * FROM unified_kpi LIMIT 5\"")
    else:
        query = sys.argv[1]
        run_query(query)
