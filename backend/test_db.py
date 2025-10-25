import sqlite3
import pandas as pd

# Connect to database
conn = sqlite3.connect('guardian.db')

# Test queries
print("=== DATABASE INFO ===")
cursor = conn.cursor()

# Get table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print(f"Tables: {tables}")

# Get row count
cursor.execute("SELECT COUNT(*) FROM patients;")
count = cursor.fetchone()[0]
print(f"Total rows: {count}")

# Get column info
cursor.execute("PRAGMA table_info(patients);")
columns = cursor.fetchall()
print(f"Columns: {[col[1] for col in columns]}")

# Sample data
print("\n=== SAMPLE DATA ===")
df = pd.read_sql_query("SELECT * FROM patients LIMIT 5", conn)
print(df)

# Close connection
conn.close()
