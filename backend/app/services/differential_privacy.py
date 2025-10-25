import numpy as np
from typing import Dict, Any, Optional
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
        """
        Add Laplace noise to achieve differential privacy
        
        Args:
            true_value: The actual query result
            epsilon: Privacy parameter (smaller = more private)
            sensitivity: Global sensitivity of the query
            
        Returns:
            Tuple of (noisy_result, noise_added)
        """
        # Laplace noise scale: sensitivity / epsilon
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
        # Get true result from database (stub for now)
        true_result = self._get_true_result(operation, column, table, filters)
        
        # Get sensitivity for this operation
        sensitivity = self.sensitivity[operation]
        

        private_result, noise = self.add_laplace_noise(true_result, epsilon, sensitivity)
        
        return private_result, noise
    
    def _get_true_result(
        self, 
        operation: QueryOperation, 
        column: str, 
        table: str, 
        filters: Optional[Dict[str, Any]] = None
    ) -> float:
        # Simulate different results based on operation
        if operation == QueryOperation.COUNT:
            return 1000.0  # Stub: 1000 records
        elif operation == QueryOperation.SUM:
            return 50000.0  # Stub: sum of values
        elif operation == QueryOperation.AVERAGE:
            return 50.0  # Stub: average value
        
        return 0.0
    
    def validate_epsilon(self, epsilon: float) -> bool:
        return epsilon > 0 and epsilon <= 10.0
