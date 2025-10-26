import os
import shutil
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.db.base import get_db
from pydantic import BaseModel
from typing import Optional
import uuid
from app.core.data_p import run_pipeline

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = os.path.join("app", "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class UploadResponse(BaseModel):
    message: str
    filename: str
    rows_processed: int
    database_name: str
    schema_detected: dict

def validate_csv_file(file: UploadFile):
    """Validate that the uploaded file is a CSV"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed"
        )

def save_upload_file(upload_file: UploadFile) -> str:
    """Save the uploaded file and return the path"""
    try:
        file_location = os.path.join(UPLOAD_DIR, upload_file.filename)
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(upload_file.file, file_object)
        return file_location
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {str(e)}"
        )
    finally:
        upload_file.file.close()





@router.post("/upload", response_model=UploadResponse)
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a CSV file and process it with differential privacy.
    Each file will create its own database with a unique name.
    """
    try:
        # Validate file type
        validate_csv_file(file)

        # Save file
        file_location = save_upload_file(file)

        # Use CSV filename (without extension) as DB name
        base_name = os.path.splitext(file.filename)[0]
        safe_base = base_name.replace(' ', '_').replace('.', '_')
        db_name = f"{safe_base}.db"
        db_path = os.path.join("app", "core", db_name)
        suffix = 1
        # If DB exists, add suffix
        while os.path.exists(db_path):
            db_name = f"{safe_base}_{suffix}.db"
            db_path = os.path.join("app", "core", db_name)
            suffix += 1

        # Process the file
        df, schema = run_pipeline(file_location, db_path)

        # Clean up the uploaded file
        os.remove(file_location)

        return UploadResponse(
            message="File uploaded and processed successfully",
            filename=file.filename,
            rows_processed=len(df),
            database_name=db_name,
            schema_detected=schema
        )
    except Exception as e:
        # Clean up in case of error
        if 'file_location' in locals() and os.path.exists(file_location):
            os.remove(file_location)
        raise HTTPException(status_code=500, detail=str(e))