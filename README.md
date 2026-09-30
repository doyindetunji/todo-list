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
- **Single-Project Vercel Native**:
  - Single repository layout directly recognized as a unified Vite + Python Serverless project on Vercel with zero monorepo configuration needed.

---

## 🛠️ Project Structure

```text
todo-list/
├── api/                  # FastAPI backend serverless application
│   ├── index.py          # FastAPI app & API endpoints
│   ├── database.py       # SQLAlchemy SQLite setup
│   ├── models.py         # Todo & Note models
│   └── schemas.py        # Pydantic validation schemas
├── src/                  # React frontend source
│   ├── components/
│   │   ├── Tabs.jsx      # Navigation tab switcher
│   │   ├── TodoList.jsx  # Todo management component
│   │   └── NotesList.jsx # Notes management component
│   ├── api.js            # Frontend API client
│   ├── App.jsx           # Main container & state management
│   ├── App.css           # Styling
│   └── main.jsx          # React DOM entrypoint
├── package.json          # Root Vite/React configuration
├── vite.config.js        # Vite config with API proxy
├── requirements.txt      # Python dependencies for API
├── test_api.py           # Automated test suite
├── vercel.json           # Vercel routing configuration
├── .gitignore
└── README.md
```

---

## 🚀 Running Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Quick Start
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the FastAPI backend:
   ```bash
   uvicorn api.index:app --reload --port 8000
   ```
4. In another terminal, start the React frontend:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. Run automated tests:
   ```bash
   pytest test_api.py
   ```

---

## ☁️ Deploying to Vercel (Single Click)

1. Go to [vercel.com](https://vercel.com) and click **"Add New..."** -> **"Project"**.
2. Select your repository: **`doyindetunji/todo-list`**.
3. Vercel automatically detects the framework preset as **Vite**.
4. Leave all default settings as they are and click **Deploy**.
