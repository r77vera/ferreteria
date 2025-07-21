// Servicio de Ventas
// Provee funciones para obtener correlativo de venta y registrar una nueva venta
// Autor: Cascade
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtiene la serie y correlativo actual para la siguiente venta
 * @returns {Promise<{serie: string, correlativo: string}>}
 */
export const getCorrelativoVenta = async () => {
  const { data } = await axios.get(`${API_BASE}/ventas/correlativo`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('lunespaf_token')}`,
    },
  });
  return data; // { serie: '110', correlativo: 'VNT-111' }
};

/**
 * Crea una nueva venta
 * @param {*} ventaData objeto con { cliente, productos, metodoPago }
 * @returns {Promise<Blob>} PDF en blob
 */
export const crearVenta = async (ventaData) => {
  const response = await axios.post(`${API_BASE}/ventas`, ventaData, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('lunespaf_token')}`,
    },
  });
  return response.data; // blob del PDF
};
