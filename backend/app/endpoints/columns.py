from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.base import get_db
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

class ColumnInfo(BaseModel):
    name: str
    type: str
    nullable: bool

class ColumnsResponse(BaseModel):
    table_name: str
    columns: List[ColumnInfo]
    total_columns: int

@router.get("/columns/{table_name}", response_model=ColumnsResponse)
async def get_columns(
    table_name: str,
    db: Session = Depends(get_db)
):
    """
    Get column information for a specific table
    """
    try:
        # Get column info using PRAGMA table_info
        result = db.execute(text(f"PRAGMA table_info({table_name})")).fetchall()
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Table '{table_name}' not found")
        
        columns = []
        for row in result:
            columns.append(ColumnInfo(
                name=row[1],  # column name
                type=row[2],  # data type
                nullable=not bool(row[3])  # not null flag
            ))
        
        return ColumnsResponse(
            table_name=table_name,
            columns=columns,
            total_columns=len(columns)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))