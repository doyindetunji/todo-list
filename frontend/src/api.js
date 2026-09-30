const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const err = await response.json();
      errorDetail = err.detail || JSON.stringify(err);
    } catch {
      // response might be empty
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Todos
  getTodos: (params = {}) => {
    const query = new URLSearchParams();
    if (params.completed !== undefined && params.completed !== '') {
      query.append('completed', params.completed);
    }
    if (params.search) {
      query.append('search', params.search);
    }
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return request(`/todos${qStr}`);
  },

  createTodo: (data) =>
    request('/todos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTodo: (id, data) =>
    request(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  toggleTodo: (id) =>
    request(`/todos/${id}/toggle`, {
      method: 'PATCH',
    }),

  deleteTodo: (id) =>
    request(`/todos/${id}`, {
      method: 'DELETE',
    }),

  // Notes
  getNotes: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) {
      query.append('category', params.category);
    }
    if (params.search) {
      query.append('search', params.search);
    }
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return request(`/notes${qStr}`);
  },

  createNote: (data) =>
    request('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateNote: (id, data) =>
    request(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteNote: (id) =>
    request(`/notes/${id}`, {
      method: 'DELETE',
    }),
};
