import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { addStock } from '../../services/productosService';
import './Form.css';

const AddStockForm = ({ onSave, onCancel, producto }) => {
  const [cantidad, setCantidad] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addStock(producto.idProducto, cantidad);
      Swal.fire('¡Stock Actualizado!', 'El stock ha sido actualizado.', 'success');
      onSave();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'No se pudo actualizar el stock.';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label>Cantidad a Agregar</label>
        <input 
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(parseInt(e.target.value, 10) || 1)}
          min="1"
          required 
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancelar</button>
        <button type="submit" disabled={isLoading} className="btn-save">
          {isLoading ? 'Agregando...' : 'Agregar Stock'}
        </button>
      </div>
    </form>
  );
};

export default AddStockForm;
