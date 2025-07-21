import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData, getAuthHeaders());
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData, getAuthHeaders());
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await axios.patch(`${API_URL}/users/${id}/status`, {}, getAuthHeaders());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
  return response.data;
};
