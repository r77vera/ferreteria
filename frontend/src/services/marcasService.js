import axios from 'axios';

const API_URL = 'http://localhost:3001/api/marcas';

const getToken = () => localStorage.getItem('token');

export const getMarcas = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const createMarca = async (marcaData) => {
  const response = await axios.post(API_URL, marcaData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const updateMarca = async (id, marcaData) => {
  const response = await axios.put(`${API_URL}/${id}`, marcaData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const deleteMarca = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};
