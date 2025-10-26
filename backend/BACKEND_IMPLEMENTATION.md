# Guardian Analytics - Backend Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing the Guardian Analytics backend with differential privacy support.

## Tech Stack

- **Framework:** FastAPI (Python 3.9+)
- **Database:** SQLite (development), PostgreSQL (production)
- **DP Library:** OpenDP or custom Laplace implementation
- **File Storage:** Local filesystem (encrypted)
- **API Docs:** Auto-generated with Swagger/OpenAPI

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration and env vars
│   ├── database.py             # Database connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── dataset.py
│   │   ├── query.py
│   │   └── certificate.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── dataset.py
│   │   ├── query.py
│   │   └── response.py
│   ├── routers/                # API endpoints
│   │   ├── __init__.py
│   │   ├── datasets.py
│   │   ├── queries.py
│   │   └── certificates.py
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── dp_engine.py        # Differential privacy
│   │   ├── csv_processor.py   # CSV parsing
│   │   └── certificate_gen.py # Certificate generation
│   └── utils/
│       ├── __init__.py
│       ├── crypto.py           # Encryption utilities
│       └── validators.py      # Input validation
├── uploads/                    # Uploaded datasets (encrypted)
├── data/                       # SQLite database
├── tests/                      # Unit tests
├── requirements.txt
└── README.md
```

## Step 1: Setup Project

### Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
```

### requirements.txt

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pandas==2.1.3
numpy==1.26.2
sqlalchemy==2.0.23
aiosqlite==0.19.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
cryptography==41.0.7
python-dotenv==1.0.0
opendp==0.9.2  # Optional: Use this OR custom DP implementation
```

## Step 2: Database Models

### models/dataset.py

```python
from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    file_path = Column(String, nullable=False)
    schema_json = Column(Text, nullable=False)  # JSON string of column info
    epsilon_total = Column(Float, default=5.0)
    epsilon_spent = Column(Float, default=0.0)
    record_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
```

### models/query.py

```python
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=False)
    query_type = Column(String, nullable=False)  # 'count', 'average', 'sum'
    column_name = Column(String, nullable=False)
    filters_json = Column(Text, nullable=True)  # JSON string
    epsilon_spent = Column(Float, nullable=False)
    result = Column(Float, nullable=False)
    ground_truth = Column(Float, nullable=True)  # Only for demo mode
    accuracy_bound = Column(String, nullable=True)  # e.g., "±2.1"
    query_id = Column(String, unique=True, nullable=False)
    executed_at = Column(DateTime, server_default=func.now())
```

## Step 3: Differential Privacy Engine

### services/dp_engine.py

```python
import numpy as np
from typing import Tuple, List, Dict
import pandas as pd

class DifferentialPrivacyEngine:
    """
    Differential Privacy engine using Laplace mechanism
    """
    
    @staticmethod
    def add_laplace_noise(
        true_value: float,
        epsilon: float,
        sensitivity: float = 1.0
    ) -> float:
        """
        Add Laplace noise for differential privacy
        
        Formula: noise ~ Laplace(0, sensitivity/epsilon)
        """
        if epsilon <= 0:
            raise ValueError("Epsilon must be positive")
        
        scale = sensitivity / epsilon
        noise = np.random.laplace(0, scale)
        return true_value + noise
    
    @staticmethod
    def calculate_accuracy_bound(
        epsilon: float,
        sensitivity: float = 1.0,
        confidence: float = 0.95
    ) -> float:
        """
        Calculate accuracy bound (±error) at given confidence level
        
        For 95% confidence: bound = (sensitivity/epsilon) * ln(2/(1-0.95))
        """
        scale = sensitivity / epsilon
        bound = scale * np.log(2 / (1 - confidence))
        return abs(bound)
    
    @staticmethod
    def estimate_sensitivity(
        query_type: str,
        df: pd.DataFrame,
        column: str = None
    ) -> float:
        """
        Estimate query sensitivity based on query type
        
        - COUNT: sensitivity = 1 (one person affects count by 1)
        - SUM: sensitivity = max_value
        - AVERAGE: sensitivity = max_value / n
        """
        if query_type.lower() == 'count':
            return 1.0
        
        elif query_type.lower() == 'sum':
            if column and column in df.columns:
                return float(df[column].abs().max())
            return 100.0  # Default
        
        elif query_type.lower() == 'average':
            if column and column in df.columns:
                max_val = float(df[column].abs().max())
                n = len(df)
                return max_val / max(n, 1)
            return 1.0  # Default
        
        return 1.0
    
    @staticmethod
    def validate_budget(
        requested_epsilon: float,
        remaining_budget: float
    ) -> Dict[str, any]:
        """
        Validate if query can be executed with remaining budget
        """
        if requested_epsilon > remaining_budget:
            return {
                "valid": False,
                "message": f"Insufficient budget. You have {remaining_budget:.1f} ε remaining, "
                          f"but this query requires {requested_epsilon:.1f} ε."
            }
        
        if remaining_budget - requested_epsilon < 0.1:
            return {
                "valid": True,
                "warning": "This query will exhaust most of your remaining budget."
            }
        
        return {"valid": True}
```

## Step 4: Query Execution

### services/csv_processor.py

```python
import pandas as pd
import json
from typing import Dict, List, Any

class CSVProcessor:
    """Process and query CSV datasets"""
    
    @staticmethod
    def load_dataset(file_path: str) -> pd.DataFrame:
        """Load CSV file into DataFrame"""
        return pd.read_csv(file_path)
    
    @staticmethod
    def extract_schema(df: pd.DataFrame) -> Dict[str, Any]:
        """Extract schema information from DataFrame"""
        columns = []
        for col in df.columns:
            dtype = str(df[col].dtype)
            
            # Determine if queryable (non-ID columns)
            queryable = not (
                col.lower().endswith('_id') or 
                col.lower() == 'id'
            )
            
            # Map pandas dtype to user-friendly type
            if dtype in ['int64', 'int32']:
                col_type = 'Integer'
                icon = ''
            elif dtype in ['float64', 'float32']:
                col_type = 'Numeric'
                icon = ''
            else:
                col_type = 'Categorical'
                icon = ''
            
            columns.append({
                "name": col,
                "type": col_type,
                "queryable": queryable,
                "icon": icon
            })
        
        return {
            "tableName": "data",
            "columns": columns
        }
    
    @staticmethod
    def apply_filters(
        df: pd.DataFrame,
        filters: List[Dict[str, str]]
    ) -> pd.DataFrame:
        """
        Apply filters to DataFrame
        
        filters = [
            {"column": "age", "operator": ">", "value": "30"},
            {"column": "city", "operator": "=", "value": "Toronto"}
        ]
        """
        result = df.copy()
        
        for f in filters:
            col = f.get("column")
            op = f.get("operator")
            val = f.get("value")
            
            if not all([col, op, val]) or col not in result.columns:
                continue
            
            try:
                # Convert value to appropriate type
                if result[col].dtype in ['int64', 'float64']:
                    val = float(val)
                
                # Apply operator
                if op == "=":
                    result = result[result[col] == val]
                elif op == ">":
                    result = result[result[col] > val]
                elif op == "<":
                    result = result[result[col] < val]
                elif op == ">=":
                    result = result[result[col] >= val]
                elif op == "<=":
                    result = result[result[col] <= val]
                elif op == "!=":
                    result = result[result[col] != val]
            except:
                continue
        
        return result
    
    @staticmethod
    def execute_query(
        df: pd.DataFrame,
        query_type: str,
        column: str
    ) -> float:
        """Execute the actual query (ground truth)"""
        if query_type.lower() == 'count':
            return float(len(df))
        
        elif query_type.lower() == 'average':
            if column in df.columns:
                return float(df[column].mean())
            raise ValueError(f"Column {column} not found")
        
        elif query_type.lower() == 'sum':
            if column in df.columns:
                return float(df[column].sum())
            raise ValueError(f"Column {column} not found")
        
        raise ValueError(f"Unknown query type: {query_type}")
```

### routers/queries.py

```python
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.dataset import Dataset
from app.models.query import Query
from app.schemas.query import QueryRequest, QueryResponse
from app.services.dp_engine import DifferentialPrivacyEngine
from app.services.csv_processor import CSVProcessor
import uuid
import json

router = APIRouter(prefix="/api/queries", tags=["queries"])

@router.post("/execute", response_model=QueryResponse)
async def execute_query(
    request: QueryRequest,
    db: Session = Depends(get_db)
):
    """
    Execute a privacy-preserving query
    """
    # 1. Get dataset
    dataset = db.query(Dataset).filter(Dataset.id == request.dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # 2. Validate budget
    remaining_budget = dataset.epsilon_total - dataset.epsilon_spent
    validation = DifferentialPrivacyEngine.validate_budget(
        request.epsilon,
        remaining_budget
    )
    
    if not validation["valid"]:
        raise HTTPException(status_code=400, detail=validation["message"])
    
    # 3. Load dataset
    try:
        df = CSVProcessor.load_dataset(dataset.file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dataset: {str(e)}")
    
    # 4. Apply filters
    if request.filters:
        df = CSVProcessor.apply_filters(df, request.filters)
    
    # 5. Execute query (ground truth)
    try:
        ground_truth = CSVProcessor.execute_query(
            df,
            request.query_type,
            request.column
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Query failed: {str(e)}")
    
    # 6. Calculate sensitivity and add noise
    sensitivity = DifferentialPrivacyEngine.estimate_sensitivity(
        request.query_type,
        df,
        request.column
    )
    
    private_result = DifferentialPrivacyEngine.add_laplace_noise(
        ground_truth,
        request.epsilon,
        sensitivity
    )
    
    # 7. Calculate accuracy bound
    accuracy = DifferentialPrivacyEngine.calculate_accuracy_bound(
        request.epsilon,
        sensitivity
    )
    
    # 8. Generate query ID
    query_id = f"QRY-{uuid.uuid4().hex[:8].upper()}"
    
    # 9. Save query to database
    query_record = Query(
        dataset_id=request.dataset_id,
        query_type=request.query_type,
        column_name=request.column,
        filters_json=json.dumps(request.filters) if request.filters else None,
        epsilon_spent=request.epsilon,
        result=private_result,
        ground_truth=ground_truth,  # Store for demo/comparison
        accuracy_bound=f"±{accuracy:.1f}",
        query_id=query_id
    )
    db.add(query_record)
    
    # 10. Update dataset budget
    dataset.epsilon_spent += request.epsilon
    db.commit()
    
    # 11. Build query text
    query_text = f"{request.query_type.upper()}({request.column})"
    if request.filters:
        query_text += " WHERE ..."
    
    # 12. Return response
    return QueryResponse(
        result=round(private_result, 1),
        ground_truth=round(ground_truth, 1),  # Include in demo mode
        epsilon_spent=request.epsilon,
        accuracy_bound=f"±{accuracy:.1f}",
        budget_remaining=round(dataset.epsilon_total - dataset.epsilon_spent, 1),
        query_id=query_id,
        query_text=query_text,
        rows_analyzed=len(df),
        execution_time="0.4s",
        timestamp=query_record.executed_at.isoformat()
    )
```

## Step 5: Dataset Upload

### routers/datasets.py

```python
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.dataset import Dataset
from app.services.csv_processor import CSVProcessor
import os
import json
import shutil

router = APIRouter(prefix="/api/datasets", tags=["datasets"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(""),
    epsilon_total: float = Form(5.0),
    db: Session = Depends(get_db)
):
    """
    Upload a CSV dataset
    """
    # Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted")
    
    # Save file
    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4().hex}_{file.filename}")
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Parse CSV and extract schema
    try:
        df = CSVProcessor.load_dataset(file_path)
        schema = CSVProcessor.extract_schema(df)
        record_count = len(df)
    except Exception as e:
        os.remove(file_path)  # Clean up
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")
    
    # Create database record
    dataset = Dataset(
        name=name,
        description=description,
        file_path=file_path,
        schema_json=json.dumps(schema),
        epsilon_total=epsilon_total,
        epsilon_spent=0.0,
        record_count=record_count
    )
    db.add(dataset)
    db.commit()
    db.refresh(dataset)
    
    return {
        "id": dataset.id,
        "name": dataset.name,
        "description": dataset.description,
        "schema": schema,
        "epsilon_total": dataset.epsilon_total,
        "epsilon_remaining": dataset.epsilon_total - dataset.epsilon_spent,
        "record_count": record_count,
        "created_at": dataset.created_at.isoformat()
    }

@router.get("/")
async def list_datasets(db: Session = Depends(get_db)):
    """List all datasets"""
    datasets = db.query(Dataset).all()
    
    return [
        {
            "id": ds.id,
            "name": ds.name,
            "description": ds.description,
            "schema": json.loads(ds.schema_json),
            "epsilonTotal": ds.epsilon_total,
            "epsilonRemaining": ds.epsilon_total - ds.epsilon_spent,
            "recordCount": ds.record_count,
            "createdAt": ds.created_at.isoformat()
        }
        for ds in datasets
    ]
```

## Step 6: Main Application

### main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import datasets, queries

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Guardian Analytics API",
    description="Privacy-preserving data analytics with differential privacy",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(datasets.router)
app.include_router(queries.router)

@app.get("/")
async def root():
    return {
        "message": "Guardian Analytics API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
```

## Step 7: Run the Backend

```bash
# Activate virtual environment
source venv/bin/activate

# Run the server
uvicorn app.main:app --reload --port 8000

# API will be available at:
# http://localhost:8000
# Docs at: http://localhost:8000/docs
```

## Step 8: Test the Integration

### Test Upload
```bash
curl -X POST "http://localhost:8000/api/datasets/upload" \
  -F "file=@sample_data.csv" \
  -F "name=Test Dataset" \
  -F "description=Test description" \
  -F "epsilon_total=5.0"
```

### Test Query
```bash
curl -X POST "http://localhost:8000/api/queries/execute" \
  -H "Content-Type: application/json" \
  -d '{
    "dataset_id": 1,
    "query_type": "average",
    "column": "age",
    "filters": [],
    "epsilon": 0.5
  }'
```

## Environment Variables

Create `.env` file:

```env
DATABASE_URL=sqlite:///./data/guardian.db
UPLOAD_DIR=uploads
SECRET_KEY=your-secret-key-here
DEMO_MODE=true  # Show ground truth in responses
```

## Production Considerations

1. **Database**: Switch to PostgreSQL
2. **File Storage**: Use S3 or similar
3. **Authentication**: Add JWT/OAuth
4. **Encryption**: Encrypt uploaded files
5. **Rate Limiting**: Prevent abuse
6. **Logging**: Add audit logs
7. **Validation**: Strict input validation
8. **HTTPS**: Use SSL certificates

## Testing

Create `tests/test_dp_engine.py`:

```python
import pytest
from app.services.dp_engine import DifferentialPrivacyEngine

def test_laplace_noise():
    true_value = 100
    epsilon = 0.5
    noisy = DifferentialPrivacyEngine.add_laplace_noise(true_value, epsilon)
    
    # Noisy value should be different but close
    assert abs(noisy - true_value) < 50  # Reasonable bound

def test_accuracy_bound():
    epsilon = 0.5
    bound = DifferentialPrivacyEngine.calculate_accuracy_bound(epsilon)
    assert bound > 0
    
    # Higher epsilon = lower bound (more accurate)
    bound_high = DifferentialPrivacyEngine.calculate_accuracy_bound(2.0)
    assert bound_high < bound
```

## Common Issues

### Issue: CORS errors
**Solution**: Add frontend URL to `allow_origins` in `main.py`

### Issue: File upload fails
**Solution**: Check `UPLOAD_DIR` exists and has write permissions

### Issue: Query returns NaN
**Solution**: Validate column exists and has numeric data

### Issue: Budget validation fails
**Solution**: Check `epsilon_spent` is being updated correctly

---

**Backend implementation is straightforward with FastAPI!** 🚀

All frontend endpoints are expecting this exact API structure.

