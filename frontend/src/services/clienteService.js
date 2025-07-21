// Servicio para Clientes
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getClientePorDNI = async (dni) => {
  const { data } = await axios.get(`${API_BASE}/clientes`, {
    params: { dni },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data; // null si no existe
};
