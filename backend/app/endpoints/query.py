from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.schemas.query import DifferentialPrivacyQuery, QueryResponse
from app.services.differential_privacy import DifferentialPrivacyService

router = APIRouter()
dp_service = DifferentialPrivacyService()

@router.post("/query", response_model=QueryResponse)
async def execute_differential_privacy_query(
    query: DifferentialPrivacyQuery,
    db: Session = Depends(get_db)
):
    """
    Execute a differentially private query on the database
    
    This endpoint applies differential privacy using the Laplace mechanism
    to provide privacy-preserving analytics on sensitive data.
    
    Args:
        query: DifferentialPrivacyQuery containing operation, column, table, epsilon, and optional filters
        
    Returns:
        QueryResponse with the private result and metadata
    """
    try:
        if not dp_service.validate_epsilon(query.epsilon):
            raise HTTPException(
                status_code=400, 
                detail="Epsilon must be between 0 and 10"
            )
        
        if query.epsilon > query.epsilon_budget:
            raise HTTPException(
                status_code=400,
                detail="Epsilon Out of Range"
            )

        if query.epsilon_budget and not dp_service.validate_range(query.epsilon, query.epsilon_budget):
            raise HTTPException(
                status_code=400,
                detail="Epsilon must be less than or equal to epsilon budget"
            )
            
        
        # Execute the private query (database access handled in service)
        private_result, noise_added = dp_service.execute_private_query(
            operation=query.operation,
            column=query.column,
            table=query.table,
            epsilon=query.epsilon,
            db=db,
            filters=query.filters                                                                   
        )
        
        # Prepare response
        response = QueryResponse(
            result=private_result,
            operation=query.operation,
            column=query.column,
            table=query.table,
            epsilon=query.epsilon,
            noise_added=noise_added,
            message=f"Differential privacy applied with ε={query.epsilon}. Noise added: {noise_added:.4f}"
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing differential privacy query: {str(e)}"
        )
