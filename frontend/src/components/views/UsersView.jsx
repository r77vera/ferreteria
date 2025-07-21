import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Shield } from 'lucide-react';
import './ViewsStyles.css';

const UsersView = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      usuario: 'admin',
      nombre: 'Administrador',
      apellido: 'Sistema',
      tipoEmpleado: 'Administrador',
      estado: 'Activo',
      fechaRegistro: '2024-01-01'
    },
    {
      id: 2,
      usuario: 'vendedor1',
      nombre: 'María',
      apellido: 'García',
      tipoEmpleado: 'Vendedor',
      estado: 'Activo',
      fechaRegistro: '2024-01-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.apellido.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-view">
      <div className="users-header">
        <div className="header-actions">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Agregar Usuario
          </button>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-info">
              <h3>{user.nombre} {user.apellido}</h3>
              <p className="username">@{user.usuario}</p>
              <div className="user-role">
                <Shield size={16} />
                {user.tipoEmpleado}
              </div>
              <div className={`user-status ${user.estado.toLowerCase()}`}>
                {user.estado}
              </div>
            </div>
            <div className="user-actions">
              <button onClick={() => setEditingUser(user)}>
                <Edit size={16} />
              </button>
              <button onClick={() => console.log('Delete user', user.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersView;
