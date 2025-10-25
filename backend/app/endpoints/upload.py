from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.core.data_p import run_pipeline
from pydantic import BaseModel

router = APIRouter()

class UploadResponse(BaseModel):
    message: str
    filename: str
    rows_processed: int
    schema_detected: dict

@router.post("/upload", response_model=UploadResponse)
async def upload_csv(
    db: Session = Depends(get_db)
):
    try:
        df, schema = run_pipeline("app/core/Independent_Medical_Reviews.csv")

        #testing databse
        res =db.query("SELECT * FROM patients").all()

        #testing schema
        
        return UploadResponse(
            message="File uploaded and processed successfully",
            filename="Independent_Medical_Reviews.csv",
            rows_processed=len(df),
            schema_detected=schema
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
