# Differential Privacy API

This API implements differential privacy using the Laplace mechanism to provide privacy-preserving analytics.

## Endpoint: POST /query

Execute a differentially private query on your database.

### Request Body

```json
{
  "operation": "SUM|AVERAGE|COUNT",
  "column": "column_name",
  "table": "table_name", 
  "epsilon": 1.0,
  "filters": {
    "optional": "filters"
  }
}
```

### Parameters

- **operation**: Type of operation to perform
  - `SUM`: Sum of values in the column
  - `AVERAGE`: Average of values in the column  
  - `COUNT`: Count of records
- **column**: Name of the column to operate on
- **table**: Name of the table to query
- **epsilon**: Privacy parameter (0 < ε ≤ 10)
  - Smaller ε = more privacy, more noise
  - Larger ε = less privacy, less noise
- **filters**: Optional dictionary of filters to apply

### Response

```json
{
  "result": 1023.45,
  "operation": "SUM",
  "column": "salary",
  "table": "employees",
  "epsilon": 1.0,
  "noise_added": 23.45,
  "message": "Differential privacy applied with ε=1.0. Noise added: 23.45"
}
```

## Example Usage

### Count Query
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "COUNT",
    "column": "id",
    "table": "users",
    "epsilon": 1.0
  }'
```

### Sum Query with Filters
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "SUM",
    "column": "salary",
    "table": "employees",
    "epsilon": 0.5,
    "filters": {"department": "engineering"}
  }'
```

### Average Query
```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "AVERAGE",
    "column": "age",
    "table": "users",
    "epsilon": 2.0
  }'
```

## Privacy Parameters

### Epsilon (ε) Guidelines
- **ε = 0.1**: Very high privacy, significant noise
- **ε = 1.0**: Standard privacy level (recommended)
- **ε = 5.0**: Lower privacy, less noise
- **ε = 10.0**: Minimal privacy, minimal noise

### Sensitivity
The algorithm uses these sensitivity values:
- **COUNT**: 1.0 (adding/removing one record changes count by ±1)
- **SUM**: 1.0 (assumes normalized data in [0,1] range)
- **AVERAGE**: 1.0 (assumes normalized data and known dataset size)

## Implementation Notes

- Uses Laplace mechanism for differential privacy
- Currently uses stub data (replace `_get_true_result` with actual DB queries)
- Noise is added using: `noise ~ Laplace(0, sensitivity/ε)`
- All operations return floating-point results

## Next Steps

1. Replace stub functions in `DifferentialPrivacyService._get_true_result()` with actual database queries
2. Implement proper sensitivity calculations based on your data ranges
3. Add authentication and rate limiting for production use
4. Consider implementing more advanced DP mechanisms (Gaussian, etc.)
