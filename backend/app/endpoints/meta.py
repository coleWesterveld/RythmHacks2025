import os
import sqlite3
from fastapi import APIRouter, HTTPException, Query
from typing import List

router = APIRouter()

DB_DIR = os.path.join("app", "core")

@router.get("/databases")
def list_databases():
    """List all available databases with short IDs."""
    try:
        dbs = [f for f in os.listdir(DB_DIR) if f.endswith('.db')]
        # Use the 8-char hash as ID (from filename)
        db_list = [
            {"id": f.replace('db_', '').replace('.db', ''), "name": f}
            for f in dbs
        ]
        return {"databases": db_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tables")
def list_tables(database: str = Query(...)):
    """List all tables in a database."""
    db_path = os.path.join(DB_DIR, database)
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database not found")
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        conn.close()
        return {"tables": tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import pandas as pd

@router.get("/columns")
def list_columns(database: str = Query(...), table: str = Query(...)):
    """List all columns in a table, with type info."""
    db_path = os.path.join(DB_DIR, database)
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database not found")
    try:
        conn = sqlite3.connect(db_path)
        # Use pandas to get dtypes
        df = pd.read_sql_query(f'SELECT * FROM {table} LIMIT 100', conn)
        columns = []
        for col in df.columns:
            dtype = str(df[col].dtype)
            if dtype.startswith('int') or dtype.startswith('float'):
                col_type = 'numeric'
            else:
                col_type = 'categorical'
            columns.append({"name": col, "type": col_type})
        conn.close()
        return {"columns": columns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/column_values")
def column_values(database: str = Query(...), table: str = Query(...), column: str = Query(...), limit: int = Query(50)):
    """Return distinct values for categorical columns or min/max for numeric columns."""
    db_path = os.path.join(DB_DIR, database)
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database not found")
    try:
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        # Inspect dtype via sample
        df = pd.read_sql_query(f'SELECT {column} FROM {table} LIMIT 100', conn)
        if df.empty:
            conn.close()
            return {"type": "unknown", "values": [], "min": None, "max": None}
        dtype = str(df[column].dtype)
        if dtype.startswith('int') or dtype.startswith('float'):
            row = cur.execute(f'SELECT MIN({column}), MAX({column}) FROM {table}').fetchone()
            conn.close()
            return {"type": "numeric", "min": row[0], "max": row[1]}
        else:
            cur.execute(f'SELECT {column} FROM {table} GROUP BY {column} ORDER BY COUNT(*) DESC LIMIT ?', (limit,))
            values = [r[0] for r in cur.fetchall()]
            conn.close()
            return {"type": "categorical", "values": values}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/database")
def delete_database(database: str = Query(...)):
    """Delete a database file by name."""
    db_path = os.path.join(DB_DIR, database)
    if not os.path.exists(db_path):
        raise HTTPException(status_code=404, detail="Database not found")
    try:
        os.remove(db_path)
        return {"message": "Database deleted", "database": database}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
