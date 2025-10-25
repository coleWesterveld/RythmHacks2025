# Hackathon Backend

This is a FastAPI-based backend service with SQLite database.

## Project Structure

```
backend/
├── app/
│   ├── api/               # API routes
│   ├── core/              # Core configuration
│   ├── db/                # Database configuration
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic models
│   ├── services/          # Business logic
│   └── main.py            # FastAPI application
├── tests/                 # Test files
├── requirements.txt       # Python dependencies
└── init_db.py            # Database initialization script
```

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize the database:
   ```bash
   python init_db.py
   ```

4. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

## API Documentation

- Interactive API docs: `http://localhost:8000/docs`
- Alternative API docs: `http://localhost:8000/redoc`
