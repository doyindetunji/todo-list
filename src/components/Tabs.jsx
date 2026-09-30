import React from 'react';
import { CheckSquare, StickyNote } from 'lucide-react';

export default function Tabs({ activeTab, onTabChange, todoCount, noteCount }) {
  return (
    <div className="tabs-container">
      <button
        type="button"
        className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
        onClick={() => onTabChange('todos')}
      >
        <CheckSquare size={18} />
        <span>Todo List</span>
        {typeof todoCount === 'number' && (
          <span className="tab-badge">{todoCount}</span>
        )}
      </button>

      <button
        type="button"
        className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
        onClick={() => onTabChange('notes')}
      >
        <StickyNote size={18} />
        <span>Notes</span>
        {typeof noteCount === 'number' && (
          <span className="tab-badge">{noteCount}</span>
        )}
      </button>
    </div>
  );
}
