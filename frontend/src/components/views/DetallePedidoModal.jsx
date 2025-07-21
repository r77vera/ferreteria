import React, { useState, useEffect } from 'react';
import { getPedidoDetalles } from '../../services/pedidosService';
import Spinner from '../common/Spinner';
import './DetallePedidoModal.css';

const DetallePedidoModal = ({ pedido, onClose }) => {
  const [detalles, setDetalles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetalles = async () => {
      if (!pedido) return;
      setIsLoading(true);
      try {
        const data = await getPedidoDetalles(pedido.idPedido);
        setDetalles(data);
      } catch (err) {
        console.error('Error fetching pedido details:', err);
        setError('No se pudieron cargar los detalles del pedido.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetalles();
  }, [pedido]);

  if (!pedido) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-btn">&times;</button>
        <h3>Detalle de Venta - Nro: {pedido.Correlativo}</h3>
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.producto.nombreProducto}</td>
                  <td>{detalle.cantidad}</td>
                  <td>S/ {parseFloat(detalle.subtotal).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="form-actions">
            <button onClick={onClose} className="btn-cancel">Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default DetallePedidoModal;
