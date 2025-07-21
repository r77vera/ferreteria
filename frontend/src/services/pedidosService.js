import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const pedidosApi = axios.create({
  baseURL: `${API_URL}/pedidos`,
});

export const getPedidos = async (page = 1, limit = 10, fechaInicio = '', fechaFin = '') => {
  try {
    const response = await pedidosApi.get('/', {
      headers: getAuthHeaders(),
      params: { page, limit, fechaInicio, fechaFin }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    throw error;
  }
};

export const getPedidoDetalles = async (id) => {
  try {
    const response = await pedidosApi.get(`/${id}/detalles`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pedido details:', error);
    throw error;
  }
};

export const getPedidoPDF = async (id) => {
  try {
    const response = await pedidosApi.get(`/${id}/pdf`, {
      headers: getAuthHeaders(),
      responseType: 'blob', // Important para manejar la respuesta como un archivo
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pedido PDF:', error);
    throw error;
  }
};
