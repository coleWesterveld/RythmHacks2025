# RythmHacks2025 🎶💻

A fullstack hackathon project with FastAPI backend and frontend. 🚀

## Project Structure 📁

├── backend/ # FastAPI backend with SQLite 🐍 ├── frontend/ # Frontend application (empty - ready for your framework ✨) ├── .gitignore # Git ignore rules 🚫 └── README.md # This file 📄


## Quick Start ⚡

### Backend Setup ⚙️

1. Navigate to backend directory:
   ```bash
   cd backend
Create virtual environment: 🌳

Bash

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies: 📦

Bash

pip install -r requirements.txt
Initialize database: 💾

Bash

python init_db.py
Run the server: ▶️

Bash

uvicorn app.main:app --reload
Access API docs at: http://localhost:8000/docs 📖

Frontend Setup 🎨
The frontend/ directory is ready for your chosen frontend framework (React, Vue, Svelte, etc.). Go wild! 🎉

Development 🛠️
Backend API: http://localhost:8000

API Documentation: http://localhost:8000/docs 📚

Alternative API docs: http://localhost:8000/redoc 📑

Tech Stack 🧱
Backend: FastAPI, SQLAlchemy, SQLite, Pydantic 🐍

Frontend: (Your choice - React, Vue, Svelte, etc.) ✨

Database: SQLite (development), easily switchable to PostgreSQL for production 🐘

Happy hacking! 🥳🚀
