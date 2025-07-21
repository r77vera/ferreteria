import React, { useState, useEffect } from 'react';

const TipoProductoForm = ({ onSave, onCancel, tipo }) => {
  const [formData, setFormData] = useState({
    nombretipoProducto: '',
  });

  useEffect(() => {
    if (tipo) {
      setFormData({ nombretipoProducto: tipo.nombretipoProducto });
    } else {
      setFormData({ nombretipoProducto: '' });
    }
  }, [tipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombretipoProducto) {
      // Basic validation
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="nombretipoProducto">Nombre del Tipo</label>
        <input
          type="text"
          id="nombretipoProducto"
          name="nombretipoProducto"
          value={formData.nombretipoProducto}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>
      <div className="modal-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn-save">
          Guardar
        </button>
      </div>
    </form>
  );
};

export default TipoProductoForm;
