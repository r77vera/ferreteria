import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { getTiposProducto, createTipoProducto, updateTipoProducto, deleteTipoProducto } from '../../services/tiposProductoService';
import Modal from '../common/Modal';
import TipoProductoForm from '../common/TipoProductoForm'; // Import the form
import './UsersView.css'; // Reusing styles for consistency

const TiposProductoView = () => {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState(null);

  const fetchTiposProducto = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTiposProducto();
      setTipos(data);
    } catch (err) {
      console.error('Fetch Tipos Error:', err);
      setError('No se pudo cargar los tipos de producto.');
      Swal.fire('Error', 'Hubo un problema al cargar los datos.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposProducto();
  }, [fetchTiposProducto]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openModal = (tipo = null) => {
    setEditingTipo(tipo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTipo(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingTipo) {
        await updateTipoProducto(editingTipo.idTipoProducto, formData);
        Swal.fire('¡Actualizado!', 'El tipo de producto ha sido actualizado.', 'success');
      } else {
        await createTipoProducto(formData);
        Swal.fire('¡Creado!', 'El nuevo tipo de producto ha sido creado.', 'success');
      }
      fetchTiposProducto();
      closeModal();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'No se pudo guardar el tipo de producto.';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ¡bórralo!',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTipoProducto(id);
          Swal.fire('¡Borrado!', 'El tipo de producto ha sido eliminado.', 'success');
          fetchTiposProducto();
        } catch (err) {
          console.error('Delete Tipo Error:', err);
          Swal.fire('Error', 'No se pudo eliminar el tipo de producto.', 'error');
        }
      }

    });
  };

  const filteredTipos = tipos.filter(tipo =>
    (tipo.nombretipoProducto || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="users-view-container">
      <div className="users-view-header">
        <h2>Gestión de Tipos de Producto</h2>
        <button onClick={() => openModal()} className="add-user-btn">
          <FontAwesomeIcon icon={faPlus} /> Agregar Tipo
        </button>
      </div>

      <div className="table-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTipos.map(tipo => (
              <tr key={tipo.idTipoProducto}>
                <td data-label="ID">{tipo.idTipoProducto}</td>
                <td data-label="Nombre">{tipo.nombretipoProducto}</td>
                <td data-label="Acciones" className="options-cell">
                  <button onClick={() => openModal(tipo)} className="icon-btn edit-btn" title="Editar">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(tipo.idTipoProducto)} className="icon-btn delete-btn" title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onClose={closeModal} title={editingTipo ? 'Editar Tipo de Producto' : 'Agregar Tipo de Producto'}>
          <TipoProductoForm 
            onSave={handleSave} 
            onCancel={closeModal} 
            tipo={editingTipo} 
          />
        </Modal>
      )}
    </div>
  );
};

export default TiposProductoView;
