import pandas as pd
import os
import numpy as np

# Create output directory one level up from where script is run (assuming run in python-engine)
output_dir = "../../test_data"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

print(f"Generating files in {os.path.abspath(output_dir)}...")

# 1. FILE CSV: Sales Data (Ventes)
# Structure: date;region;revenue;margin
dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='ME') # Month End
regions = ['Nord', 'Sud', 'Est', 'Ouest']
data_csv = []

for date in dates:
    for region in regions:
        # Random realistic values
        rev = np.random.randint(10000, 50000)
        margin = int(rev * np.random.uniform(0.2, 0.4)) # 20-40% margin
        data_csv.append({
            'date': date.strftime('%Y-%m-%d'),
            'region': region,
            'revenue': rev,
            'margin': margin
        })

df_csv = pd.DataFrame(data_csv)
csv_path = os.path.join(output_dir, "ventes_2024.csv")
df_csv.to_csv(csv_path, index=False, sep=';')
print(f"Created {csv_path}")

# 2. FILE JSON: HR Data (Ressources Humaines)
# Structure: month, department, new_hires, satisfaction_score
months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06']
depts = ['IT', 'Sales', 'Marketing']
data_json = []

for month in months:
    for dept in depts:
        data_json.append({
            'month': month,
            'department': dept,
            'new_hires': np.random.randint(0, 5),
            'satisfaction_score': round(np.random.uniform(3.5, 5.0), 1)
        })

df_json = pd.DataFrame(data_json)
json_path = os.path.join(output_dir, "rh_2024.json")
df_json.to_json(json_path, orient='records', indent=2)
print(f"Created {json_path}")

# 3. FILE EXCEL: Budget Data (Finance)
# Structure: Category, Q1_Budget, Q2_Budget, Q3_Budget, Q4_Budget
categories = ['Licences Logiciels', 'Matériel Info', 'Formations', 'Voyages', 'Locaux']
data_excel = {
    'Category': categories,
    'Q1_Allocated': [15000, 25000, 5000, 8000, 12000],
    'Q2_Allocated': [12000, 10000, 8000, 12000, 12000],
    'Q3_Allocated': [12000, 5000, 2000, 5000, 12000],
    'Q4_Allocated': [18000, 15000, 10000, 8000, 12000]
}

df_excel = pd.DataFrame(data_excel)
xlsx_path = os.path.join(output_dir, "budget_2024.xlsx")
df_excel.to_excel(xlsx_path, index=False)
print(f"Created {xlsx_path}")
