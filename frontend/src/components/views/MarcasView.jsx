import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { getMarcas, createMarca, updateMarca, deleteMarca } from '../../services/marcasService';
import Modal from '../common/Modal';
import MarcaForm from '../common/MarcaForm'; // This will be created next
import './UsersView.css'; // Reusing styles

const MarcasView = () => {
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMarca, setEditingMarca] = useState(null);

  const fetchMarcas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMarcas();
      setMarcas(data);
    } catch {
      setError('No se pudieron cargar las marcas.');
      Swal.fire('Error', 'No se pudieron cargar las marcas.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarcas();
  }, [fetchMarcas]);

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const openModal = (marca = null) => {
    setEditingMarca(marca);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMarca(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingMarca) {
        await updateMarca(editingMarca.idMarca, formData);
        Swal.fire('¡Actualizada!', 'La marca ha sido actualizada.', 'success');
      } else {
        await createMarca(formData);
        Swal.fire('¡Creada!', 'La nueva marca ha sido creada.', 'success');
      }
      closeModal();
      fetchMarcas();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'No se pudo guardar la marca.';
      Swal.fire('Error', errorMessage, 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, ¡bórrala!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteMarca(id);
        Swal.fire('¡Borrada!', 'La marca ha sido eliminada.', 'success');
        fetchMarcas();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar la marca.', 'error');
      }
    }
  };

  const filteredMarcas = marcas.filter(marca =>
    (marca.nombreMarca || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="users-view-container">
      <div className="users-view-header">
        <h2>Gestión de Marcas</h2>
        <button onClick={() => openModal()} className="add-user-btn">
          <FontAwesomeIcon icon={faPlus} /> Agregar Marca
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
            {filteredMarcas.map(marca => (
              <tr key={marca.idMarca}>
                <td data-label="ID">{marca.idMarca}</td>
                <td data-label="Nombre">{marca.nombreMarca}</td>
                <td data-label="Acciones" className="options-cell">
                  <button onClick={() => openModal(marca)} className="icon-btn edit-btn" title="Editar">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(marca.idMarca)} className="icon-btn delete-btn" title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onClose={closeModal} title={editingMarca ? 'Editar Marca' : 'Agregar Marca'}>
          <MarcaForm 
            onSave={handleSave} 
            onCancel={closeModal} 
            marca={editingMarca} 
          />
        </Modal>
      )}
    </div>
  );
};

export default MarcasView;
