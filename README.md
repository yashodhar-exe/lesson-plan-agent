# Agent 5 - Lesson Plan Agent

This is the backend for the Agentic AI Hackathon project, specifically implementing Agent 5 (Lesson Plan Agent) and Agent 6 (Variance Agent) using Google ADK, FastAPI, PostgreSQL, and Gemini API.

## Architecture
- **Framework:** FastAPI
- **Agent Framework:** Google ADK (Agent Development Kit)
- **LLM Engine:** Gemini API
- **Database:** PostgreSQL (with `pgvector` for semantic search / RAG)
- **Document Parsing:** `pdfplumber` and `pytesseract`

## Setup Instructions

### 1. Requirements
- Python 3.10+
- PostgreSQL server running locally
- [Tesseract OCR for Windows](https://github.com/UB-Mannheim/tesseract/wiki) (Install manually if not present, the parser will fall back to mock extraction if it's missing)

### 2. Database Configuration
Ensure PostgreSQL is running locally.
Create a database named `lesson_plan_db`.
```sql
CREATE DATABASE lesson_plan_db;
```

Update your `.env` file with the correct PostgreSQL credentials if they differ from the default (`postgres:postgres`):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lesson_plan_db
```

### 3. Installation
Activate the virtual environment and install dependencies:
```powershell
# Create virtual env if it doesn't exist
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install requirements (Assuming they are already installed via pyproject.toml)
pip install .
```

### 5. Seeding Data
Run the seed script to populate PostgreSQL with demo data (Institutions, Courses, Timetable, Calendar Events, etc.):
```powershell
python seed/seed_data.py
```

### 6. Running the Demo Scenario
Execute the demo script to walk through the complete hackathon scenario (Generation -> Publication -> Progress Update -> Variance Detection -> Replanning):
```powershell
python demo.py
```

### 7. Starting the API Server
To start the FastAPI server for the frontend to connect to:
```powershell
uvicorn app.main:app --reload
```
You can access the API documentation at `http://localhost:8000/docs`.

## Testing
Run unit tests with pytest:
```powershell
pytest
```
