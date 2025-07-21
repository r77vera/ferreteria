import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faPowerOff, faCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } from '../../services/userService';
import Modal from '../common/Modal';
import UserForm from '../common/UserForm';
import Spinner from '../common/Spinner';
import './UsersView.css';

const UsersView = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('No se pudieron cargar los usuarios.');
      Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡bórralo!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        Swal.fire('¡Borrado!', 'El usuario ha sido eliminado.', 'success');
        fetchUsers();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      await toggleUserStatus(user.id);
      Swal.fire('Actualizado', 'El estado del usuario ha sido cambiado.', 'success');
      fetchUsers();
    } catch {
      Swal.fire('Error', 'No se pudo cambiar el estado del usuario.', 'error');
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
        Swal.fire('Actualizado', 'El usuario ha sido actualizado.', 'success');
      } else {
        await createUser(userData);
        Swal.fire('Creado', 'El nuevo usuario ha sido creado.', 'success');
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'No se pudo guardar el usuario.';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.empleado?.nombreEmpleado || ''} ${user.empleado?.apellidoEmpleado || ''}`.toLowerCase();
    const username = (user.Usuario || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || username.includes(search);
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="users-view-container">
      <div className="users-view-header">
        <h2>Gestión de Usuarios</h2>
        <button onClick={handleAddUser} className="add-user-btn">
          <FontAwesomeIcon icon={faPlus} /> Agregar Usuario
        </button>
      </div>

      <div className="table-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre o usuario..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Usuario</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td data-label="Nombre">{`${user.empleado?.nombreEmpleado || ''} ${user.empleado?.apellidoEmpleado || ''}`}</td>
                <td data-label="Usuario">{user.Usuario}</td>
                <td data-label="Tipo">{user.empleado?.tipoEmpleado?.nombreTipoEmpleado || 'N/A'}</td>
                <td data-label="Estado">
                  <span className={`status-badge ${user.empleado?.estado ? 'status-active' : 'status-inactive'}`}>
                    {user.empleado?.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td data-label="Creado">{formatDate(user.empleado?.fecha_registro)}</td>
                <td data-label="Opciones" className="options-cell">
                  <button onClick={() => handleEditUser(user)} className="icon-btn edit-btn" title="Editar">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="icon-btn delete-btn" title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    className={`icon-btn ${user.empleado?.estado ? 'power-off-btn' : 'power-on-btn'}`}
                    title={user.empleado?.estado ? 'Desactivar' : 'Activar'}
                  >
                    <FontAwesomeIcon icon={user.empleado?.estado ? faPowerOff : faCheck} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        show={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingUser ? 'Editar Usuario' : 'Agregar Usuario'}
      >
        <UserForm 
          onSave={handleSaveUser} 
          onCancel={handleCloseModal} 
          user={editingUser} 
        />
      </Modal>
    </div>
  );
};

export default UsersView;
