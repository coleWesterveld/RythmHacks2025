# RythmHacks2025

A fullstack hackathon project with FastAPI backend and frontend.

## Project Structure

```
├── backend/           # FastAPI backend with SQLite
├── frontend/          # Frontend application (empty - ready for your framework)
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize database:
   ```bash
   python init_db.py
   ```

5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

6. Access API docs at: http://localhost:8000/docs

### Frontend Setup

The `frontend/` directory is ready for your chosen frontend framework (React, Vue, Svelte, etc.).

## Development

- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Alternative API docs: http://localhost:8000/redoc

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic
- **Frontend**: (Your choice - React, Vue, Svelte, etc.)
- **Database**: SQLite (development), easily switchable to PostgreSQL for production

Happy hacking! 🚀
