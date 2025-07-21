import React, { useState } from 'react';
import { changePassword } from '../../services/authService';
import Swal from 'sweetalert2';
import './UserProfileView.css';

const UserProfileView = ({ user }) => {
  const datos = user?.user || {}; // datos internos del usuario
  const nombreCompleto = `${datos?.nombre || ''} ${datos?.apellido || ''}`;
  const initial = datos?.nombre?.charAt(0).toUpperCase() || 'U';

    const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

      const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas nuevas no coinciden.',
      });
      return;
    }

    try {
      const data = await changePassword(currentPassword, newPassword);
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: data.message,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo actualizar la contraseña.',
      });
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
            <label><strong>Contraseña Actual:</strong></label><br />
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Nueva Contraseña:</strong></label><br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label><strong>Confirmar Nueva Contraseña:</strong></label><br />
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
