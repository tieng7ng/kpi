import requests
import os

url = "http://localhost:8000/api/upload"
file_path = "../../test_data/ventes_2024.csv"

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
    # Try to generate it if missing (should be there from previous step)
    # But let's just abort if missing
    exit(1)

try:
    with open(file_path, 'rb') as f:
        files = {'file': (os.path.basename(file_path), f, 'text/csv')}
        print(f"Sending {file_path} to {url}...")
        response = requests.post(url, files=files)
        
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

except requests.exceptions.ConnectionError:
    print("Error: Could not connect to localhost:8000. Is the server running?")
except Exception as e:
    print(f"An error occurred: {e}")
