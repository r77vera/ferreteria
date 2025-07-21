import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faBox } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { getProductos, deleteProducto } from '../../services/productosService';
import { getMarcas } from '../../services/marcasService';
import { getTiposProducto } from '../../services/tiposProductoService';
import Modal from '../common/Modal';
import ProductoForm from '../common/ProductoForm';
import AddStockForm from '../common/AddStockForm';
import Spinner from '../common/Spinner';
import './UsersView.css';

const ProductosView = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selectedMarca, setSelectedMarca] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');

    useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const marcasData = await getMarcas();
        const tiposData = await getTiposProducto();
        setMarcas(marcasData);
        setTipos(tiposData);
      } catch (error) {
        console.error('Failed to fetch filter data', error);
      }
    };
    fetchFilterData();
  }, []);

  const fetchProductos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProductos(searchTerm, currentPage, itemsPerPage, selectedMarca, selectedTipo);
      setProductos(data.productos || []);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch {
      setError('No se pudieron cargar los productos.');
      Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, itemsPerPage, selectedMarca, selectedTipo]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProductos();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchProductos]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMarca, selectedTipo]);

  const handleSearch = (event) => setSearchTerm(event.target.value);

  const openModal = (producto = null) => {
    setEditingProducto(producto);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProducto(null);
    fetchProductos();
  };

  const openStockModal = (producto) => {
    setEditingProducto(producto);
    setIsStockModalOpen(true);
  };

  const closeStockModal = () => {
    setIsStockModalOpen(false);
    setEditingProducto(null);
    fetchProductos();
  };

  const handleDelete = async (id) => {
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
        await deleteProducto(id);
        Swal.fire('¡Borrado!', 'El producto ha sido eliminado.', 'success');
        fetchProductos();
      } catch {
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="users-view-container">
      <div className="users-view-header">
        <h2>Gestión de Productos</h2>
        <button onClick={() => openModal()} className="add-user-btn">
          <FontAwesomeIcon icon={faPlus} /> Agregar Producto
        </button>
      </div>

      <div className="table-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select className="filter-select" value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)}>
          <option value="">Todas las Marcas</option>
          {marcas.map(marca => (
            <option key={marca.idMarca} value={marca.idMarca}>{marca.nombreMarca}</option>
          ))}
        </select>
        <select className="filter-select" value={selectedTipo} onChange={(e) => setSelectedTipo(e.target.value)}>
          <option value="">Todos los Tipos</option>
          {tipos.map(tipo => (
            <option key={tipo.idTipoProducto} value={tipo.idTipoProducto}>{tipo.nombretipoProducto}</option>
          ))}
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Tipo</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.idProducto}>
                <td data-label="ID">{producto.idProducto}</td>
                <td data-label="Nombre">{producto.nombreProducto}</td>
                <td data-label="Marca">{producto.marca?.nombreMarca || 'N/A'}</td>
                <td data-label="Tipo">{producto.tipoProducto?.nombretipoProducto || 'N/A'}</td>
                <td data-label="Stock">{producto.stock}</td>
                <td data-label="Precio">S/ {producto.precioNormal}</td>
                <td data-label="Acciones" className="options-cell">
                  <button onClick={() => openStockModal(producto)} className="icon-btn stock-btn" title="Agregar Stock">
                    <FontAwesomeIcon icon={faBox} />
                  </button>
                  <button onClick={() => openModal(producto)} className="icon-btn edit-btn" title="Editar">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(producto.idProducto)} className="icon-btn delete-btn" title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onClose={closeModal} title={editingProducto ? 'Editar Producto' : 'Agregar Producto'}>
          <ProductoForm 
            onSave={closeModal} 
            onCancel={closeModal} 
            producto={editingProducto} 
          />
        </Modal>
      )}

      {isStockModalOpen && (
        <Modal show={isStockModalOpen} onClose={closeStockModal} title={`Agregar Stock a ${editingProducto?.nombreProducto}`}>
          <AddStockForm 
            onSave={closeStockModal} 
            onCancel={closeStockModal} 
            producto={editingProducto} 
          />
        </Modal>
      )}
    </div>
  );
};

export default ProductosView;
