import numpy as np
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.schemas.query import QueryOperation

class DifferentialPrivacyService:
    """
    Differential Privacy service implementing Laplace mechanism
    """
    
    def __init__(self):
        # Sensitivity values for different operations
        self.sensitivity = {
            QueryOperation.COUNT: 1.0,  # Adding/removing one record changes count by at most 1
            QueryOperation.SUM: 1.0,    # Assuming normalized data (0-1 range)
            QueryOperation.AVERAGE: 1.0  # Assuming normalized data and known dataset size
        }
    
    def add_laplace_noise(self, true_value: float, epsilon: float, sensitivity: float) -> tuple[float, float]:
        scale = sensitivity / epsilon
        
        # Generate Laplace noise
        noise = np.random.laplace(0, scale)
        
        # Add noise to true value
        noisy_result = true_value + noise
        
        return noisy_result, noise
    
    def execute_private_query(
        self, 
        operation: QueryOperation, 
        column: str, 
        table: str, 
        epsilon: float,
        db: Session,
        filters: Optional[Dict[str, Any]] = None
    ) -> tuple[float, float]:
        """
        Execute a differentially private query
        
        Args:
            operation: Type of operation (SUM, AVERAGE, COUNT)
            column: Column to operate on
            table: Table to query
            epsilon: Privacy parameter
            filters: Optional filters for the query
            
        Returns:
            Tuple of (private_result, noise_added)
        """
        # Get true result from database
        true_result = self._get_true_result(operation, column, table, db, filters)
        
        # Get sensitivity for this operation
        sensitivity = self.sensitivity[operation]
        

        private_result, noise = self.add_laplace_noise(true_result, epsilon, sensitivity)
        
        return private_result, noise
    
    def _get_true_result(
        self, 
        operation: QueryOperation, 
        column: str, 
        table: str, 
        db: Session,
        filters: Optional[Dict[str, Any]] = None
    ) -> float:
        
        if operation == QueryOperation.COUNT:
            result = db.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            return float(result)
        elif operation == QueryOperation.SUM:
            result = db.execute(text(f"SELECT SUM({column}) FROM {table}")).scalar()
            return float(result or 0)
        elif operation == QueryOperation.AVERAGE:
            result = db.execute(text(f"SELECT AVG({column}) FROM {table}")).scalar()
            return float(result or 0)
        
        return 0.0
    
    def validate_epsilon(self, epsilon: float) -> bool:
        print("Validating epsilon:", type(epsilon), epsilon)
        return epsilon > 0.0 and epsilon <= 10.0
