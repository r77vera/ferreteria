import React, { useState, useEffect } from 'react';

const UserForm = ({ onSave, onCancel, user }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    usuario: '',
    contrasena: '',
    idTipoEmpleado: '002',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.empleado?.nombreEmpleado || '',
        apellido: user.empleado?.apellidoEmpleado || '',
        dni: user.empleado?.idEmpleado || '',
        usuario: user.Usuario || '',
        contrasena: '',
        idTipoEmpleado: user.empleado?.idTipoEmpleado || '002',
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        usuario: '',
        contrasena: '',
        idTipoEmpleado: '002',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (user && !dataToSave.contrasena) {
      delete dataToSave.contrasena;
    }
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="form-row">
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Apellido</label>
          <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group">
        <label>DNI / ID Empleado</label>
        <input type="text" name="dni" value={formData.dni} onChange={handleChange} required disabled={!!user} />
      </div>
      <div className="form-group">
        <label>Usuario</label>
        <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Contraseña {user ? '(opcional)' : ''}</label>
        <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} required={!user} />
      </div>
      <div className="form-group">
        <label>Tipo de Empleado</label>
        <select name="idTipoEmpleado" value={formData.idTipoEmpleado} onChange={handleChange}>
          <option value="000">Super Admin</option>
          <option value="001">Admin</option>
          <option value="002">Vendedor</option>
          <option value="003">Cajero</option>
        </select>
      </div>
      <div className="modal-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancelar</button>
        <button type="submit" className="btn-save">Guardar</button>
      </div>
    </form>
  );
};

export default UserForm;
