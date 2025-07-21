import React, { useState } from 'react';
import { Plus, Search, Eye, Receipt, Calendar, DollarSign } from 'lucide-react';
import './SalesView.css';

const SalesView = () => {
  const [sales, setSales] = useState([
    {
      id: 1,
      correlativo: 'V-001',
      cliente: 'Juan Pérez',
      empleado: 'María García',
      fecha: '2024-01-20',
      hora: '14:30',
      metodoPago: 'Efectivo',
      total: 125.50,
      igv: 22.59,
      items: [
        { producto: 'Martillo Stanley', cantidad: 2, precio: 25.99, subtotal: 51.98 },
        { producto: 'Tornillos Phillips', cantidad: 100, precio: 0.15, subtotal: 15.00 }
      ]
    },
    {
      id: 2,
      correlativo: 'V-002',
      cliente: 'Ana López',
      empleado: 'Carlos Ruiz',
      fecha: '2024-01-20',
      hora: '15:45',
      metodoPago: 'Tarjeta',
      total: 89.99,
      igv: 16.20,
      items: [
        { producto: 'Taladro Inalámbrico', cantidad: 1, precio: 89.99, subtotal: 89.99 }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showNewSale, setShowNewSale] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.correlativo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || sale.fecha === dateFilter;
    return matchesSearch && matchesDate;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="sales-view">
      <div className="sales-header">
        <div className="header-stats">
          <div className="stat-item">
            <DollarSign size={24} />
            <div>
              <span className="stat-value">${totalSales.toFixed(2)}</span>
              <span className="stat-label">Total Ventas</span>
            </div>
          </div>
          <div className="stat-item">
            <Receipt size={24} />
            <div>
              <span className="stat-value">{filteredSales.length}</span>
              <span className="stat-label">Transacciones</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar ventas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="date-filter">
            <Calendar size={20} />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <button 
            className="new-sale-btn"
            onClick={() => setShowNewSale(true)}
          >
            <Plus size={20} />
            Nueva Venta
          </button>
        </div>
      </div>

      <div className="sales-table">
        <div className="table-header">
          <div>Correlativo</div>
          <div>Cliente</div>
          <div>Fecha</div>
          <div>Método Pago</div>
          <div>Total</div>
          <div>Acciones</div>
        </div>

        {filteredSales.map(sale => (
          <div key={sale.id} className="table-row">
            <div className="correlativo">{sale.correlativo}</div>
            <div>{sale.cliente}</div>
            <div>{sale.fecha} {sale.hora}</div>
            <div>
              <span className={`payment-method ${sale.metodoPago.toLowerCase()}`}>
                {sale.metodoPago}
              </span>
            </div>
            <div className="total">${sale.total.toFixed(2)}</div>
            <div className="actions">
              <button 
                className="view-btn"
                onClick={() => setSelectedSale(sale)}
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSales.length === 0 && (
        <div className="no-sales">
          <Receipt size={48} />
          <h3>No se encontraron ventas</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}

      {/* Sale Detail Modal */}
      {selectedSale && (
        <SaleDetailModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}

      {/* New Sale Modal */}
      {showNewSale && (
        <NewSaleModal
          onSave={(saleData) => {
            const newSale = {
              id: Date.now(),
              correlativo: `V-${String(sales.length + 1).padStart(3, '0')}`,
              fecha: new Date().toISOString().split('T')[0],
              hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              ...saleData
            };
            setSales([...sales, newSale]);
            setShowNewSale(false);
          }}
          onCancel={() => setShowNewSale(false)}
        />
      )}
    </div>
  );
};

const SaleDetailModal = ({ sale, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal sale-detail-modal">
        <div className="modal-header">
          <h2>Detalle de Venta - {sale.correlativo}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="sale-info">
          <div className="info-grid">
            <div className="info-item">
              <label>Cliente:</label>
              <span>{sale.cliente}</span>
            </div>
            <div className="info-item">
              <label>Empleado:</label>
              <span>{sale.empleado}</span>
            </div>
            <div className="info-item">
              <label>Fecha:</label>
              <span>{sale.fecha}</span>
            </div>
            <div className="info-item">
              <label>Hora:</label>
              <span>{sale.hora}</span>
            </div>
            <div className="info-item">
              <label>Método de Pago:</label>
              <span>{sale.metodoPago}</span>
            </div>
          </div>

          <div className="items-section">
            <h3>Productos</h3>
            <div className="items-table">
              <div className="items-header">
                <div>Producto</div>
                <div>Cantidad</div>
                <div>Precio Unit.</div>
                <div>Subtotal</div>
              </div>
              {sale.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div>{item.producto}</div>
                  <div>{item.cantidad}</div>
                  <div>${item.precio.toFixed(2)}</div>
                  <div>${item.subtotal.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="totals-section">
            <div className="total-row">
              <span>IGV (18%):</span>
              <span>${sale.igv.toFixed(2)}</span>
            </div>
            <div className="total-row final">
              <span>Total:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewSaleModal = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    empleado: 'Usuario Actual',
    metodoPago: 'Efectivo',
    items: [{ producto: '', cantidad: 1, precio: 0 }]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = formData.items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    onSave({
      ...formData,
      items: formData.items.map(item => ({
        ...item,
        subtotal: item.cantidad * item.precio
      })),
      igv,
      total
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { producto: '', cantidad: 1, precio: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal new-sale-modal">
        <div className="modal-header">
          <h2>Nueva Venta</h2>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Cliente</label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Método de Pago</label>
              <select
                value={formData.metodoPago}
                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="items-section">
            <div className="section-header">
              <h3>Productos</h3>
              <button type="button" onClick={addItem} className="add-item-btn">
                <Plus size={16} />
                Agregar Producto
              </button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="item-form">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={item.producto}
                  onChange={(e) => updateItem(index, 'producto', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={item.cantidad}
                  onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 0)}
                  min="1"
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={item.precio}
                  onChange={(e) => updateItem(index, 'precio', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  required
                />
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Guardar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesView;
