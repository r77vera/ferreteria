import axios from 'axios';

const API_URL = 'http://localhost:3001/api/productos';

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getProductos = async (searchTerm = '', page = 1, limit = 10, marcaId = '', tipoId = '') => {
  const response = await axios.get(API_URL, {
    params: { search: searchTerm, page, limit, marcaId, tipoId },
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getProductoById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createProducto = async (productoData) => {
  const response = await axios.post(API_URL, productoData, getAuthHeaders());
  return response.data;
};

export const updateProducto = async (id, productoData) => {
  const response = await axios.put(`${API_URL}/${id}`, productoData, getAuthHeaders());
  return response.data;
};

export const deleteProducto = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const addStock = async (id, cantidad) => {
  const response = await axios.patch(`${API_URL}/${id}/stock`, { cantidad }, getAuthHeaders());
  return response.data;
};
