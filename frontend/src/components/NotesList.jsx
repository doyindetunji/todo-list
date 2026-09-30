import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, FileText, Tag, Calendar } from 'lucide-react';

const CATEGORIES = ['General', 'Work', 'Ideas', 'Personal', 'Study'];

export default function NotesList({
  notes,
  loading,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('General');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onAddNote({
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
    });
    setTitle('');
    setContent('');
    setCategory('General');
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category || 'General');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
    setEditCategory('General');
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editContent.trim()) return;
    await onUpdateNote(id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      category: editCategory.trim() || 'General',
    });
    cancelEdit();
  };

  const filteredNotes = notes.filter((note) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : note.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="tab-content">
      {/* Create Note Card */}
      <div className="card creation-card">
        <h3 className="section-title">Take a Note</h3>
        <form onSubmit={handleSubmit} className="form-stack">
          <div className="input-group">
            <input
              type="text"
              className="text-input"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <textarea
              className="text-area"
              placeholder="Write your note contents here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="form-footer-row">
            <div className="category-select-wrapper">
              <Tag size={16} className="category-icon" />
              <select
                className="select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="primary-btn">
              <Plus size={18} />
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>

      {/* Controls: Search and Category Filters */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search notes..."
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
            className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({notes.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = notes.filter((n) => n.category.toLowerCase() === cat.toLowerCase()).length;
            if (count === 0 && selectedCategory !== cat) return null;
            return (
              <button
                key={cat}
                type="button"
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="notes-grid">
        {loading && notes.length === 0 ? (
          <div className="status-message">Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state grid-full-width">
            <FileText size={48} className="empty-icon" />
            <p className="empty-title">
              {searchTerm
                ? 'No notes match your search'
                : selectedCategory !== 'all'
                ? `No notes found in category "${selectedCategory}"`
                : 'No notes yet. Create your first note above!'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const isEditing = editingId === note.id;

            return (
              <div key={note.id} className="note-card">
                {isEditing ? (
                  <div className="edit-form-wrapper">
                    <input
                      type="text"
                      className="text-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Note title"
                    />
                    <textarea
                      className="text-area"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Note content"
                      rows={5}
                    />
                    <div className="category-select-wrapper" style={{ marginTop: '0.5rem' }}>
                      <Tag size={16} className="category-icon" />
                      <select
                        className="select-input"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="edit-actions">
                      <button
                        type="button"
                        className="save-btn"
                        onClick={() => saveEdit(note.id)}
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
                  <div className="note-content-wrapper">
                    <div className="note-header">
                      <h4 className="note-title">{note.title}</h4>
                      <span className="category-pill">{note.category}</span>
                    </div>

                    <p className="note-body">{note.content}</p>

                    <div className="note-footer">
                      <div className="timestamp-wrapper">
                        <Calendar size={13} />
                        <span>{formatDate(note.updated_at || note.created_at)}</span>
                      </div>

                      <div className="item-actions">
                        <button
                          type="button"
                          className="action-icon-btn"
                          title="Edit note"
                          onClick={() => startEdit(note)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn delete-icon-btn"
                          title="Delete note"
                          onClick={() => onDeleteNote(note.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
