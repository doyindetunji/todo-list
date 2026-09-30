import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit2, X, Search, CheckCircle2, Circle } from 'lucide-react';

export default function TodoList({
  todos,
  loading,
  onAddTodo,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAddTodo({ title: title.trim(), description: description.trim() || null });
    setTitle('');
    setDescription('');
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    await onUpdateTodo(id, {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
    });
    cancelEdit();
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'completed'
        ? todo.completed
        : !todo.completed;

    const matchesSearch =
      todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description &&
        todo.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="tab-content">
      {/* Create Todo Card */}
      <div className="card creation-card">
        <h3 className="section-title">Add New Task</h3>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="input-group">
            <input
              type="text"
              className="text-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <textarea
              className="text-area"
              placeholder="Add details or notes (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <button type="submit" className="primary-btn">
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </form>
      </div>

      {/* Control bar: Filters & Search */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({todos.length - completedCount})
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Todo List Items */}
      <div className="items-list">
        {loading && todos.length === 0 ? (
          <div className="status-message">Loading tasks...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={48} className="empty-icon" />
            <p className="empty-title">
              {searchTerm
                ? 'No tasks match your search'
                : filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                ? 'No active tasks! You are all caught up.'
                : 'No tasks yet. Create one above to get started!'}
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => {
            const isEditing = editingId === todo.id;

            return (
              <div
                key={todo.id}
                className={`todo-card ${todo.completed ? 'completed' : ''}`}
              >
                {isEditing ? (
                  <div className="edit-form-wrapper">
                    <input
                      type="text"
                      className="text-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Task title"
                    />
                    <textarea
                      className="text-area"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Task description (optional)"
                      rows={2}
                    />
                    <div className="edit-actions">
                      <button
                        type="button"
                        className="save-btn"
                        onClick={() => saveEdit(todo.id)}
                      >
                        <Check size={16} /> Save
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={cancelEdit}
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="todo-item-content">
                    <button
                      type="button"
                      className="toggle-btn"
                      onClick={() => onToggleTodo(todo.id)}
                      title={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="checked-icon" size={22} />
                      ) : (
                        <Circle className="unchecked-icon" size={22} />
                      )}
                    </button>

                    <div className="todo-details">
                      <span className="todo-title">{todo.title}</span>
                      {todo.description && (
                        <p className="todo-description">{todo.description}</p>
                      )}
                    </div>

                    <div className="item-actions">
                      <button
                        type="button"
                        className="action-icon-btn"
                        title="Edit task"
                        onClick={() => startEdit(todo)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn delete-icon-btn"
                        title="Delete task"
                        onClick={() => onDeleteTodo(todo.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
