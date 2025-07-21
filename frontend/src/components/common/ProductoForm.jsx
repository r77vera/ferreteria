import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createProducto, updateProducto } from '../../services/productosService';
import { getMarcas } from '../../services/marcasService';
import { getTiposProducto } from '../../services/tiposProductoService';
import './Form.css';

const ProductoForm = ({ onSave, onCancel, producto }) => {
  const [formData, setFormData] = useState({
    nombreProducto: '',
    descripciónProducto: '',
    idMarca: '',
    idTipoProducto: '',
    precioCompra: '',
    precioNormal: '',
    precioMinimo: '',
    precioPaquete: '',
    stock: '',
  });
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [marcasData, tiposData] = await Promise.all([
          getMarcas(),
          getTiposProducto(),
        ]);
        setMarcas(marcasData);
        setTipos(tiposData);
      } catch { 
        Swal.fire('Error', 'No se pudieron cargar los datos para el formulario.', 'error');
      }
    };

    fetchDropdownData();

    if (producto) {
      setFormData({
        nombreProducto: producto.nombreProducto || '',
        descripciónProducto: producto.descripciónProducto || '',
        idMarca: producto.idMarca || '',
        idTipoProducto: producto.idTipoProducto || '',
        precioCompra: producto.precioCompra || '',
        precioNormal: producto.precioNormal || '',
        precioMinimo: producto.precioMinimo || '',
        precioPaquete: producto.precioPaquete || '',
        stock: producto.stock || '',
      });
    }
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSubmit = { ...formData };
    const numericFields = ['precioCompra', 'precioNormal', 'precioMinimo', 'precioPaquete', 'stock'];

    numericFields.forEach(field => {
      if (dataToSubmit[field] === '' || dataToSubmit[field] === null) {
        dataToSubmit[field] = null;
      }
    });

    try {
      if (producto) {
        await updateProducto(producto.idProducto, dataToSubmit);
        Swal.fire('¡Actualizado!', 'El producto ha sido actualizado.', 'success');
      } else {
        await createProducto(dataToSubmit);
        Swal.fire('¡Creado!', 'El nuevo producto ha sido creado.', 'success');
      }
      onSave();
    } catch (err) {
      const errorMessage = err.response?.data?.details || err.response?.data?.error || 'No se pudo guardar el producto.';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
            <div className="form-group">
                <label>Nombre del Producto</label>
                <input type="text" name="nombreProducto" value={formData.nombreProducto} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Descripción</label>
                <input type="text" name="descripciónProducto" value={formData.descripciónProducto} onChange={handleChange} />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Marca</label>
                <select name="idMarca" value={formData.idMarca} onChange={handleChange} required>
                    <option value="">Seleccione una marca</option>
                    {marcas.map(marca => (
                        <option key={marca.idMarca} value={marca.idMarca}>{marca.nombreMarca}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Tipo de Producto</label>
                <select name="idTipoProducto" value={formData.idTipoProducto} onChange={handleChange} required>
                    <option value="">Seleccione un tipo</option>
                    {tipos.map(tipo => (
                        <option key={tipo.idTipoProducto} value={tipo.idTipoProducto}>{tipo.nombretipoProducto}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Precio Compra</label>
                <input type="number" step="0.01" name="precioCompra" value={formData.precioCompra} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Precio Normal</label>
                <input type="number" step="0.01" name="precioNormal" value={formData.precioNormal} onChange={handleChange} required />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Precio Mínimo</label>
                <input type="number" step="0.01" name="precioMinimo" value={formData.precioMinimo} onChange={handleChange} />
            </div>
            <div className="form-group">
                <label>Precio Paquete</label>
                <input type="number" step="0.01" name="precioPaquete" value={formData.precioPaquete} />
            </div>
        </div>

        <div className="form-row">
            <div className="form-group">
                <label>Stock Inicial</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required disabled={!!producto} />
            </div>
        </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-cancel">Cancelar</button>
        <button type="submit" disabled={isLoading} className="btn-save">
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;
