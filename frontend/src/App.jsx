import React, { useEffect, useState } from 'react';
import { api } from './api';
import Tabs from './components/Tabs';
import TodoList from './components/TodoList';
import NotesList from './components/NotesList';
import { Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('todos');
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Fetch initial todos
  const fetchTodos = async () => {
    setLoadingTodos(true);
    try {
      const data = await api.getTodos();
      setTodos(data);
    } catch (err) {
      showNotification(`Failed to load todos: ${err.message}`, 'error');
    } finally {
      setLoadingTodos(false);
    }
  };

  // Fetch initial notes
  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch (err) {
      showNotification(`Failed to load notes: ${err.message}`, 'error');
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchNotes();
  }, []);

  // Todo Handlers
  const handleAddTodo = async (todoData) => {
    try {
      const created = await api.createTodo(todoData);
      setTodos((prev) => [created, ...prev]);
      showNotification('Task added successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const updated = await api.toggleTodo(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleUpdateTodo = async (id, data) => {
    try {
      const updated = await api.updateTodo(id, data);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showNotification('Task updated successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      showNotification('Task removed');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Notes Handlers
  const handleAddNote = async (noteData) => {
    try {
      const created = await api.createNote(noteData);
      setNotes((prev) => [created, ...prev]);
      showNotification('Note saved successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleUpdateNote = async (id, data) => {
    try {
      const updated = await api.updateNote(id, data);
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
      showNotification('Note updated successfully!');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await api.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      showNotification('Note removed');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {notification && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="logo-box">
            <Layers size={24} className="logo-icon" />
          </div>
          <div>
            <h1 className="app-title">Task & Notes Hub</h1>
            <p className="app-subtitle">Streamline your day, capture your thoughts</p>
          </div>
        </div>

        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          todoCount={todos.length}
          noteCount={notes.length}
        />
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'todos' ? (
          <TodoList
            todos={todos}
            loading={loadingTodos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
          />
        ) : (
          <NotesList
            notes={notes}
            loading={loadingNotes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </main>
    </div>
  );
}
