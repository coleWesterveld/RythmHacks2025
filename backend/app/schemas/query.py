from pydantic import BaseModel, Field
from typing import Literal, Optional, Dict, Any
from enum import Enum

class QueryOperation(str, Enum):
    SUM = "SUM"
    AVERAGE = "AVERAGE"
    COUNT = "COUNT"

class DifferentialPrivacyQuery(BaseModel):
    operation: QueryOperation
    column: str = Field(..., description="Column name to perform operation on")
    table: str = Field(..., description="Table name to query")
    epsilon: float = Field(..., gt=0, description="Privacy parameter (epsilon > 0)")
    epsilon_budget: Optional[float] = Field(None, gt=0, description="Total privacy budget available (optional)")
    filters: Optional[Dict[str, Any]] = Field(None, description="Optional filters for the query")

class QueryResponse(BaseModel):
    result: float
    operation: QueryOperation
    column: str
    table: str
    epsilon: float
    noise_added: float
    message: str
