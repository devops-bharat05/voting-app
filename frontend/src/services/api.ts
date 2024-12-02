import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const polls = {
  create: (data: { title: string; description: string; options: string[]; endDate: string }) =>
    api.post('/polls', data),
  getAll: () => api.get('/polls'),
  getById: (id: string) => api.get(`/polls/${id}`),
  vote: (id: string, optionId: string) =>
    api.post(`/polls/${id}/vote`, { optionId }),
  getUserPolls: () => api.get('/polls/user'),
};

export default api;