import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, Filter } from 'lucide-react';
import './ProductsView.css';

const ProductsView = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      nombre: 'Martillo Stanley',
      marca: 'Stanley',
      tipo: 'Herramientas',
      precio: 25.99,
      stock: 50,
      descripcion: 'Martillo de acero con mango ergonómico'
    },
    {
      id: 2,
      nombre: 'Tornillos Phillips',
      marca: 'Truper',
      tipo: 'Ferretería',
      precio: 0.15,
      stock: 1000,
      descripcion: 'Tornillos Phillips 2" x 100 unidades'
    },
    {
      id: 3,
      nombre: 'Taladro Inalámbrico',
      marca: 'Bosch',
      tipo: 'Herramientas Eléctricas',
      precio: 89.99,
      stock: 15,
      descripcion: 'Taladro inalámbrico 18V con batería'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.marca.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || product.tipo === filterType;
    return matchesSearch && matchesFilter;
  });

  const productTypes = [...new Set(products.map(p => p.tipo))];

  const handleAddProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
  };

  const handleEditProduct = (productData) => {
    setProducts(products.map(p => 
      p.id === editingProduct.id ? { ...editingProduct, ...productData } : p
    ));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="products-view">
      <div className="products-header">
        <div className="header-actions">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-container">
            <Filter size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              {productTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            Agregar Producto
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <div className="product-icon">
                <Package size={24} />
              </div>
              <div className="product-actions">
                <button 
                  className="edit-btn"
                  onClick={() => setEditingProduct(product)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="product-info">
              <h3>{product.nombre}</h3>
              <p className="product-brand">{product.marca}</p>
              <p className="product-type">{product.tipo}</p>
              <p className="product-description">{product.descripcion}</p>
            </div>

            <div className="product-footer">
              <div className="product-price">${product.precio}</div>
              <div className={`product-stock ${product.stock < 20 ? 'low' : ''}`}>
                Stock: {product.stock}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <Package size={48} />
          <h3>No se encontraron productos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onSave={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: product?.nombre || '',
    marca: product?.marca || '',
    tipo: product?.tipo || '',
    precio: product?.precio || '',
    stock: product?.stock || '',
    descripcion: product?.descripcion || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock)
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marca</label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo</label>
              <input
                type="text"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              {product ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsView;
