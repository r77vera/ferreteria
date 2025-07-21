// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth'; // Ajusta el puerto/endpoint según tu backend

export const login = async (usuario, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      usuario,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Puedes agregar aquí más funciones relacionadas con autenticación (logout, refresh, etc.)
