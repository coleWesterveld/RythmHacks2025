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
        
        if noisy_result <= 0:
            return self.add_laplace_noise(true_value, epsilon, sensitivity)

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
        # Optional: enforce minimum cohort size to avoid tiny groups
        cohort_size = self._get_count(table, db, filters)
        MIN_COHORT = 25
        if cohort_size < MIN_COHORT:
            raise ValueError(f"Cohort too small (n={cohort_size}). Minimum required is {MIN_COHORT} to protect privacy.")

        # Get true result from database (with parameter binding)
        true_result = self._get_true_result(operation, column, table, db, filters)
        
        # Get sensitivity for this operation
        sensitivity = self.sensitivity[operation]
        

        private_result, noise = self.add_laplace_noise(true_result, epsilon, sensitivity)
        
        return private_result, noise
    
    def _build_where_clause(self, filters: Optional[Dict[str, Any]]):
        if not filters:
            return "", {}
        clauses = []
        params = {}
        for i, (col, val) in enumerate(filters.items()):
            key = f"p{i}"
            clauses.append(f"{col} = :{key}")
            params[key] = val
        return " WHERE " + " AND ".join(clauses), params

    def _get_true_result(
        self, 
        operation: QueryOperation, 
        column: str, 
        table: str, 
        db: Session,
        filters: Optional[Dict[str, {"value": Any, "operator": str}]] = None
    ) -> float:
        where_sql, params = self._build_where_clause(filters)

        if operation == QueryOperation.COUNT:
            sql = text(f"SELECT COUNT(*) FROM {table}{where_sql}")
            result = db.execute(sql, params).scalar()
            return float(result or 0)
        elif operation == QueryOperation.SUM:
            sql = text(f"SELECT SUM({column}) FROM {table}{where_sql}")
            result = db.execute(sql, params).scalar()
            return float(result or 0)
        elif operation == QueryOperation.AVERAGE:
            sql = text(f"SELECT AVG({column}) FROM {table}{where_sql}")
            result = db.execute(sql, params).scalar()
            return float(result or 0)
        
        return 0.0

    def _get_count(self, table: str, db: Session, filters: Optional[Dict[str, Any]] = None) -> int:
        where_sql, params = self._build_where_clause(filters)
        sql = text(f"SELECT COUNT(*) FROM {table}{where_sql}")
        result = db.execute(sql, params).scalar()
        return int(result or 0)
    
    def validate_epsilon(self, epsilon: float) -> bool:        
        return epsilon > 0.0 and epsilon <= 10.0
    
    def validate_range(self, epsilon: float, epsilon_budget: float) -> bool:
      return epsilon <= epsilon_budget
