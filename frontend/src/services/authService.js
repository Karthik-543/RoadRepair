import api from './api';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('roadsense_token', response.data.token);
    localStorage.setItem('roadsense_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('roadsense_token', response.data.token);
    localStorage.setItem('roadsense_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  if (response.data.user) {
    localStorage.setItem('roadsense_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('roadsense_token');
  localStorage.removeItem('roadsense_user');
};
