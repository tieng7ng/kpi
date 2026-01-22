import requests
import os

# Fichier de test
filename = "extract_377_71_260114_1428 - 2025 ROUTE IMPORT.csv"
filepath = "/Users/tiengd/Documents/tuto/kpi/test_data/extract_377_71_260114_1428 - 2025 ROUTE IMPORT.csv"
url = "http://localhost:8000/api/upload"

if not os.path.exists(filepath):
    print(f"❌ File not found: {filepath}")
    exit(1)

print(f"📤 Uploading {filename}...")
with open(filepath, "rb") as f:
    files = {"file": (filename, f, "text/csv")}
    try:
        r = requests.post(url, files=files)
        print(f"Status: {r.status_code}")
        print(f"Response: {r.json()}")
    except Exception as e:
        print(f"❌ Failed to upload: {e}")
        exit(1)

print("\n📊 Checking Stats...")
try:
    r_stats = requests.get("http://localhost:8000/api/transport/stats")
    print(f"Stats: {r_stats.json()}")
except Exception as e:
    print(f"❌ Failed to get stats: {e}")
