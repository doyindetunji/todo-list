import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from api.database import Base, get_db
from api.index import app

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_todo_crud_flow():
    create_res = client.post(
        "/api/todos",
        json={"title": "Finish Assignment", "description": "Complete HNG stage task"},
    )
    assert create_res.status_code == 201
    todo = create_res.json()
    assert todo["id"] is not None
    assert todo["title"] == "Finish Assignment"
    assert todo["completed"] is False
    todo_id = todo["id"]

    list_res = client.get("/api/todos")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    toggle_res = client.patch(f"/api/todos/{todo_id}/toggle")
    assert toggle_res.status_code == 200
    assert toggle_res.json()["completed"] is True

    update_res = client.put(
        f"/api/todos/{todo_id}",
        json={"title": "Finish Assignment Updated", "completed": True},
    )
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Finish Assignment Updated"

    del_res = client.delete(f"/api/todos/{todo_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/todos/{todo_id}")
    assert get_res.status_code == 404


def test_note_crud_flow():
    create_res = client.post(
        "/api/notes",
        json={"title": "Meeting Notes", "content": "Discuss project architecture", "category": "Work"},
    )
    assert create_res.status_code == 201
    note = create_res.json()
    assert note["id"] is not None
    assert note["title"] == "Meeting Notes"
    assert note["category"] == "Work"
    note_id = note["id"]

    list_res = client.get("/api/notes")
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1

    update_res = client.put(
        f"/api/notes/{note_id}",
        json={"content": "Updated discussion on React & FastAPI architecture"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["content"] == "Updated discussion on React & FastAPI architecture"

    del_res = client.delete(f"/api/notes/{note_id}")
    assert del_res.status_code == 204

    get_res = client.get(f"/api/notes/{note_id}")
    assert get_res.status_code == 404
