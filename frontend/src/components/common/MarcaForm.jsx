import React, { useState, useEffect } from 'react';

const MarcaForm = ({ onSave, onCancel, marca }) => {
  const [formData, setFormData] = useState({
    nombreMarca: '',
  });

  useEffect(() => {
    if (marca) {
      setFormData({ nombreMarca: marca.nombreMarca });
    } else {
      setFormData({ nombreMarca: '' });
    }
  }, [marca]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombreMarca) {
      return; // Basic validation
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-group">
        <label htmlFor="nombreMarca">Nombre de la Marca</label>
        <input
          type="text"
          id="nombreMarca"
          name="nombreMarca"
          value={formData.nombreMarca}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancelar</button>
        <button type="submit" className="btn-save">Guardar</button>
      </div>
    </form>
  );
};

export default MarcaForm;
