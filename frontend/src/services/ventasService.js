// Servicio de Ventas
// Provee funciones para obtener correlativo de venta y registrar una nueva venta
// Autor: Cascade
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Obtiene la serie y correlativo actual para la siguiente venta
 * @returns {Promise<{serie: string, correlativo: string}>}
 */
export const getCorrelativoVenta = async () => {
  const { data } = await axios.get(`${API_BASE}/ventas/correlativo`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return data; // { serie: '110', correlativo: 'VNT-111' }
};

/**
 * Crea una nueva venta
 * @param {Object} ventaData  Estructura esperada por el backend:
 * {
 *   dni: '12345678',            // opcional si es cliente nuevo
 *   cliente: { nombre, apellido }, // opcional si ya existe
 *   productos: [{ codigo, nombre, cantidad, precio }],
 *   totals: {
 *     subtotal: 0,
 *     igv: 0,
 *     total: 0,
 *     montoRecibido: 0, // opcional
 *     vuelto: 0         // opcional
 *   },
 *   metodoPago: 'EFECTIVO' | 'YAPE' | 'TRANSFERENCIA' | 'DINERODE'
 * }
 * @returns {Promise<Blob>} PDF en blob
 */
export const crearVenta = async (ventaData) => {
  const response = await axios.post(`${API_BASE}/ventas`, ventaData, {
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data; // blob del PDF
};
