import pandas as pd
import sqlite3
import json

csv_path = 'Independent_Medical_Reviews.csv'  

# Load CSV file
def load_data(file_path):
    df = pd.read_csv(file_path)
    return df

# Preprocess
def preprocess_data(df):

    df = df.dropna(how='all')      #  
    df = df.drop_duplicates()      

    #normalize columns names
    df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

    #  handle missing values
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].fillna(-1)  # missing ints to  -1
        else:
            df[col] = df[col].fillna("UNKNOWN")  # missing names UNKNOWN
    return df



# Detect schema: numeric, categorical, sensitive
def detect_schema(df):
    schema = {}
    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            schema[col] = "numeric"
        elif df[col].nunique() <= 50:
            schema[col] = "categorical"
        else:
            schema[col] = "sensitive"
    with open("schema.json", "w") as f:
        json.dump(schema, f, indent=4)
    return schema


# Filter out sensitive columns (optional)
def filter_sensitive(df, schema):
    safe_cols = [col for col, col_type in schema.items() if col_type != "sensitive"]
    return df[safe_cols]
  

#Save to SQLite database
def save_to_sqlite(df, db_path="guardian.db", table_name="patients"):
    conn = sqlite3.connect(db_path)
    df.to_sql(table_name, conn, if_exists="replace", index=False)
    conn.close()



#Full pipeline
def run_pipeline(csv_path, db_path="guardian.db"):
    df = load_data(csv_path)
    print(f"loaded{len(df)} rows")

    df = preprocess_data(df)

    schema = detect_schema(df)

    df = filter_sensitive(df, schema)

    save_to_sqlite(df, db_path=db_path)

    print(f"SQLite DB: {db_path}")
    print(f"Schema saved to: schema.json")

    return df, schema


