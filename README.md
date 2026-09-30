# Task & Notes Hub

A full-stack productivity web application built with **FastAPI** (Python) and **React** (Vite), featuring persistent SQLite storage and a dual-tab interface for managing Todo items and Notes.

---

## ✨ Features

- **Two Tab Interface**:
  - **Todo List**: Create tasks with descriptions, toggle completed status, edit tasks inline, delete tasks, and filter by All / Active / Done with instant search.
  - **Notes**: Create notes with categories (Work, Ideas, Personal, Study, General), edit notes, remove notes, filter by category, and search in titles/content.
- **Backend API**:
  - Built with FastAPI and SQLAlchemy ORM.
  - SQLite database for persistent storage.
  - Interactive Swagger documentation available at `/docs`.
- **Modern UI**:
  - Clean responsive design with Lucide icons.
  - Fast feedback toast notifications.
  - Dark mode aesthetic.

---

## 🛠️ Project Structure

```text
todo-list/
├── backend/
│   ├── database.py       # SQLAlchemy engine and session setup
│   ├── models.py         # Todo and Note database models
│   ├── schemas.py        # Pydantic schemas for request & response validation
│   ├── main.py           # FastAPI app and API endpoints
│   ├── test_main.py      # Automated tests with pytest & TestClient
│   └── requirements.txt  # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Tabs.jsx      # Navigation tab switcher
│   │   │   ├── TodoList.jsx  # Todo management component
│   │   │   └── NotesList.jsx # Notes management component
│   │   ├── api.js            # Frontend API client
│   │   ├── App.jsx           # Main container & state management
│   │   ├── App.css           # Styling
│   │   └── main.jsx          # React DOM entrypoint
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
1. Open a terminal and navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   - On Windows (PowerShell):
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - On Linux/macOS:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will run at `http://localhost:8000`.
   API Documentation is accessible at `http://localhost:8000/docs`.

5. Run automated tests:
   ```bash
   pytest
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 📡 API Endpoints

### Todos
- `GET /api/todos` - List todos (supports `?completed=true|false` and `?search=...`)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/{id}` - Get a specific todo
- `PUT /api/todos/{id}` - Update title, description, or completed status
- `PATCH /api/todos/{id}/toggle` - Toggle completion status
- `DELETE /api/todos/{id}` - Delete a todo

### Notes
- `GET /api/notes` - List notes (supports `?category=...` and `?search=...`)
- `POST /api/notes` - Create a new note
- `GET /api/notes/{id}` - Get a specific note
- `PUT /api/notes/{id}` - Update title, content, or category
- `DELETE /api/notes/{id}` - Delete a note
