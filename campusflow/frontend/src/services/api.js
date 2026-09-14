/**
 * CampusFlow Centralized API Client Service
 * Configured for communication with the Node.js Express backend.
 * Automatically attaches JWT Bearer token from localStorage.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Retrieve token if present in localStorage
  const token = localStorage.getItem('campusflow_token');

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error(`CampusFlow API Error [${endpoint}]:`, error);
    return {
      ok: false,
      status: 0,
      error: error.message || 'Unable to connect to backend server',
    };
  }
}

export const api = {
  // Health probe
  checkHealth: async () => {
    return await request('/health');
  },

  // Database probe
  checkDb: async () => {
    return await request('/db-test');
  },

  // Authentication endpoints
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => request('/auth/me'),
    logout: () => {
      localStorage.removeItem('campusflow_token');
      localStorage.removeItem('campusflow_user');
    },
    getToken: () => localStorage.getItem('campusflow_token'),
    getUser: () => {
      try {
        const u = localStorage.getItem('campusflow_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    }
  },

  // Students endpoints (Admin)
  students: {
    getAll: (search) => request(search ? `/students?search=${encodeURIComponent(search)}` : '/students'),
    getById: (id) => request(`/students/${id}`),
    create: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/students/${id}`, { method: 'DELETE' }),
    getMarks: (id) => request(`/students/${id}/marks`),
    addMark: (id, markData) => request(`/students/${id}/marks`, { method: 'POST', body: JSON.stringify(markData) }),
  },

  // Marks endpoints
  marks: {
    getMyMarks: () => request('/marks'),
    update: (id, data) => request(`/marks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/marks/${id}`, { method: 'DELETE' }),
  },

  // Profile endpoints (Student)
  profile: {
    get: () => request('/profile'),
    update: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Admin Dashboard Statistics
  admin: {
    getStats: () => request('/admin/stats'),
  }
};

export default api;
