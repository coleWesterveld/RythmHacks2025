from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.query import DifferentialPrivacyQuery, QueryResponse

router = APIRouter()

@router.get("/columns", response_model=QueryResponse)
async def get_columns(
    db: Session = Depends(get_db)
):
    return db.query("SELECT * FROM columns").all()