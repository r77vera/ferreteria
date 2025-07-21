import React from 'react';
import './UserProfileView.css';

const UserProfileView = ({ user }) => {
  const initial = user?.usuario?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="profile-view">
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <h2 className="profile-name">{user?.usuario}</h2>
        <p className="profile-role">{user?.role}</p>
      </div>
      <div className="profile-details">
        <h3>Detalles</h3>
        <ul>
          <li><strong>Usuario:</strong> {user?.usuario}</li>
          <li><strong>Rol:</strong> {user?.role}</li>
          {user?.email && <li><strong>Email:</strong> {user.email}</li>}
          {user?.fechaIngreso && <li><strong>Fecha de ingreso:</strong> {user.fechaIngreso}</li>}
        </ul>
      </div>
    </div>
  );
};

export default UserProfileView;
