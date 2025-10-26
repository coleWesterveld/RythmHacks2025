from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.schemas.query import DifferentialPrivacyQuery, QueryResponse
from app.services.differential_privacy import DifferentialPrivacyService

router = APIRouter()
dp_service = DifferentialPrivacyService()

@router.post("/query", response_model=QueryResponse)
async def execute_differential_privacy_query(
    query: DifferentialPrivacyQuery
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
        # Validate epsilon parameter
        print("Validating epsilon:", type(query.epsilon), query.epsilon)

        if not dp_service.validate_epsilon(query.epsilon):
            raise HTTPException(
                status_code=400, 
                detail="Epsilon must be between 0 and 10"
            )
        
        # Validate epsilon budget if provided
        if query.epsilon_budget and query.epsilon > query.epsilon_budget:
            raise HTTPException(
                status_code=400,
                detail="Epsilon must be less than or equal to epsilon budget"
            )
        
        # Get database_name from query (must be passed in body)
        if not hasattr(query, 'database_name') and 'database_name' not in query.__dict__:
            raise HTTPException(status_code=400, detail="database_name must be provided in the request body")
        db_filename = query.__dict__.get('database_name') or getattr(query, 'database_name', None)
        db_path = f"sqlite:///app/core/{db_filename}"
        engine = create_engine(db_path, connect_args={"check_same_thread": False})
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        try:
            private_result, noise_added = dp_service.execute_private_query(
                operation=query.operation,
                column=query.column,
                table=query.table,
                epsilon=query.epsilon,
                db=db,
                filters=query.filters
            )
        finally:
            db.close()
        
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
        import traceback
        print("\n--- QUERY ERROR ---")
        traceback.print_exc()
        print("--- END QUERY ERROR ---\n")
        return HTTPException(
            status_code=500,
            detail=f"Error executing differential privacy query: {repr(e)}"
        )