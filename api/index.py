import os
import sys
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Add directory to sys.path so imports work in all execution contexts
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

try:
    from .database import Base, engine, get_db
    from . import models, schemas
except ImportError:
    from database import Base, engine, get_db
    import models, schemas


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Todo & Notes API",
    description="Backend API for Todos and Notes",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "Todo and Notes API is running"}


# ==========================================
# TODOS ENDPOINTS
# ==========================================

@app.get("/api/todos", response_model=List[schemas.TodoOut])
def get_todos(
    completed: Optional[bool] = Query(None, description="Filter by completion status"),
    search: Optional[str] = Query(None, description="Search term for title or description"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Todo)
    if completed is not None:
        query = query.filter(models.Todo.completed == completed)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (models.Todo.title.ilike(search_pattern))
            | (models.Todo.description.ilike(search_pattern))
        )
    return query.order_by(models.Todo.id.desc()).all()


@app.post("/api/todos", response_model=schemas.TodoOut, status_code=status.HTTP_201_CREATED)
def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_todo = models.Todo(
        title=todo.title.strip(),
        description=todo.description.strip() if todo.description else None,
        completed=False,
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.get("/api/todos/{todo_id}", response_model=schemas.TodoOut)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/api/todos/{todo_id}", response_model=schemas.TodoOut)
def update_todo(todo_id: int, update_data: schemas.TodoUpdate, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if update_data.title is not None:
        todo.title = update_data.title.strip()
    if update_data.description is not None:
        todo.description = update_data.description.strip() if update_data.description else None
    if update_data.completed is not None:
        todo.completed = update_data.completed

    db.commit()
    db.refresh(todo)
    return todo


@app.patch("/api/todos/{todo_id}/toggle", response_model=schemas.TodoOut)
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    todo.completed = not todo.completed
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    db.delete(todo)
    db.commit()
    return None


# ==========================================
# NOTES ENDPOINTS
# ==========================================

@app.get("/api/notes", response_model=List[schemas.NoteOut])
def get_notes(
    category: Optional[str] = Query(None, description="Filter by note category"),
    search: Optional[str] = Query(None, description="Search in note title or content"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Note)
    if category:
        query = query.filter(models.Note.category.ilike(category))
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (models.Note.title.ilike(search_pattern))
            | (models.Note.content.ilike(search_pattern))
        )
    return query.order_by(models.Note.id.desc()).all()


@app.post("/api/notes", response_model=schemas.NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Note(
        title=note.title.strip(),
        content=note.content.strip(),
        category=note.category.strip() if note.category else "General",
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@app.get("/api/notes/{note_id}", response_model=schemas.NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@app.put("/api/notes/{note_id}", response_model=schemas.NoteOut)
def update_note(note_id: int, update_data: schemas.NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    if update_data.title is not None:
        note.title = update_data.title.strip()
    if update_data.content is not None:
        note.content = update_data.content.strip()
    if update_data.category is not None:
        note.category = update_data.category.strip() if update_data.category else "General"

    db.commit()
    db.refresh(note)
    return note


@app.delete("/api/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()
    return None
