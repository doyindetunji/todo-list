# Task & Notes Hub

A full-stack productivity web application built with **FastAPI** (Python) and **React** (Vite), featuring self-contained **SQLite** storage and a dual-tab interface for managing Todo items and Notes.

---

## ✨ Features

- **Two Tab Interface**:
  - **Todo List**: Create tasks with descriptions, toggle completed status, edit tasks inline, delete tasks, and filter by All / Active / Done with instant search.
  - **Notes**: Create notes with categories (Work, Ideas, Personal, Study, General), edit notes, remove notes, filter by category, and search in titles/content.
- **Backend API**:
  - Built with FastAPI and SQLAlchemy ORM.
  - Completely self-contained SQLite database with zero external service dependencies.
  - Interactive Swagger documentation available at `/docs`.
- **Modern UI**:
  - Clean responsive design with Lucide icons.
  - Fast feedback toast notifications.
  - Dark mode aesthetic.
- **Vercel Ready**:
  - Preconfigured with `vercel.json` and serverless entry point `api/index.py`.

---

## 🛠️ Project Structure

```text
todo-list/
├── api/
│   └── index.py          # Vercel serverless entry point
├── backend/
│   ├── database.py       # SQLAlchemy engine and session setup (SQLite)
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
├── vercel.json           # Vercel unified deployment config
├── requirements.txt      # Root Python dependencies for Vercel
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

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
   The backend runs at `http://localhost:8000`.
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
   Open `http://localhost:5173` in your browser. (API requests are automatically proxied to `http://127.0.0.1:8000`).

---

## ☁️ Deployment Notes

### Deploying to Vercel
The repository includes `vercel.json` and `api/index.py` for deploying on Vercel without any external services:
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Click **Deploy**.

> **Note on Vercel & SQLite**:
> Because Vercel serverless functions have a read-only filesystem, the backend writes SQLite to `/tmp/app.db`. On Vercel, the app will run and function properly, but keep in mind that serverless instances are ephemeral (they reset when the container goes cold). For permanent persistent SQLite on disk, you can also host the backend on a persistent container service (like Render or Railway).
