from database.connection import get_db
from database.models import RawImport, UnifiedKPI

db = next(get_db())

print("--- RAW IMPORTS ---")
imports = db.query(RawImport).all()
for i in imports:
    print(f"ID: {i.id} | File: {i.filename} | Status: {i.status} | Checksum: {i.checksum[:10]}...")

print("\n--- UNIFIED KPI (First 5) ---")
kpis = db.query(UnifiedKPI).limit(5).all()
for k in kpis:
    print(f"Date: {k.date} | KPI: {k.kpi_name} | Val: {k.value} | Cat: {k.category}")

print(f"\nTotal KPIs: {db.query(UnifiedKPI).count()}")
