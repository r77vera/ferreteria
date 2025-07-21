import axios from 'axios';

const API_URL = 'http://localhost:3001/api/tipos-producto';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return {};
  }
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getTiposProducto = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const createTipoProducto = async (tipoProductoData) => {
  const response = await axios.post(API_URL, tipoProductoData, getAuthHeaders());
  return response.data;
};

export const updateTipoProducto = async (id, tipoProductoData) => {
  const response = await axios.put(`${API_URL}/${id}`, tipoProductoData, getAuthHeaders());
  return response.data;
};

export const deleteTipoProducto = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
