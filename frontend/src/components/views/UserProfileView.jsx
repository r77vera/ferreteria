import React, { useState } from 'react';
import './UserProfileView.css';

const UserProfileView = ({ user }) => {
  const datos = user?.user || {}; // datos internos del usuario
  const nombreCompleto = `${datos?.nombre || ''} ${datos?.apellido || ''}`;
  const initial = datos?.nombre?.charAt(0).toUpperCase() || 'U';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
    } else {
      // lógica para cambiar la contraseña
      console.log('Contraseña nueva:', password);
      alert('Contraseña actualizada correctamente');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="profile-view">
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <h2 className="profile-name">{nombreCompleto}</h2>
        <p className="profile-role">{datos?.tipoEmpleado}</p>
      </div>

      <div className="profile-details">
        <h3>Detalles</h3>
        <ul>
          <li><strong>DNI:</strong> {datos?.DNI}</li>
          <li><strong>ID Empleado:</strong> {datos?.idEmpleado}</li>
          <li><strong>Tipo Empleado:</strong> {datos?.tipoEmpleado}</li>
          <li><strong>Fecha de ingreso:</strong> {datos?.fechaIngreso}</li>
        </ul>
      </div>

      <div className="profile-details">
        <h3>Cambiar Contraseña</h3>
        <form onSubmit={handlePasswordChange}>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Ingresar nueva contraseña:</strong></label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Repetir nueva contraseña:</strong></label><br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#f5b700',
              color: '#232526',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Cambiar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileView;
