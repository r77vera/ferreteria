import React, { useState, useEffect } from 'react';
import { getClientePorDNI } from '../../services/clienteService';
import { getCorrelativoVenta, crearVenta } from '../../services/ventasService';
import { getProductos } from '../../services/productosService';
import { Search, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import './NuevaVentaView.css';

const capitalizar = (text = '') => text.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

const NuevaVentaView = ({ onVentaCompletada }) => {
  const [dni, setDni] = useState('');
  const [cliente, setCliente] = useState({ nombre: '', apellido: '' });
  const [buscandoCliente, setBuscandoCliente] = useState(false);

  const [productos, setProductos] = useState([]); // { codigo, nombre, cantidad, precio, tipoPrecio }
  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '',
    nombre: '',
    cantidad: 1,
    precio: 0,
    tipoPrecio: 'normal',
    precios: { normal: 0, minimo: 0, paquete: 0 },
  });
  const [catalogo, setCatalogo] = useState([]); // listado de productos

  const [serie, setSerie] = useState('');
  const [correlativo, setCorrelativo] = useState('');

  // Al montar obtenemos serie/correlativo
  useEffect(() => {
    const cargarCorrelativo = async () => {
      try {
        const data = await getCorrelativoVenta();
        setSerie(data.serie);
        setCorrelativo(data.correlativo);
      } catch (err) {
        console.error('Error al obtener correlativo', err);
      }
    };
    cargarCorrelativo();
    // cargar catálogo de productos
    (async () => {
      try {
        const data = await getProductos('', 1, 1000);
        setCatalogo(data.productos || data);
      } catch (err) {
        console.error('Error al cargar productos', err);
      }
    })();
  }, []);

  const buscarCliente = async () => {
    if (!dni) return;
    setBuscandoCliente(true);
    try {
      // 1. Intentar BD
      const res = await getClientePorDNI(dni);
      if (res) {
        setCliente({ nombre: capitalizar(res.nombreCliente), apellido: capitalizar(res.apellidoCliente) });
      } else {
        // 2. API externa
        const apiRes = await fetch(`https://apiperu.dev/api/dni/${dni}?api_token=8aec577ec41f90a15ac61417ade5c76da96603b94916cd7b65215afdd9612d36`).then(r => r.json());
        if (apiRes?.success && apiRes.data) {
          setCliente({ nombre: capitalizar(apiRes.data.nombres), apellido: capitalizar(`${apiRes.data.apellido_paterno} ${apiRes.data.apellido_materno}`) });
        } else {
          Swal.fire('No encontrado', 'No se encontró información del DNI', 'warning');
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error al buscar cliente', 'error');
    } finally {
      setBuscandoCliente(false);
    }
  };

  const seleccionarProducto = (id) => {
    const prod = catalogo.find((p) => String(p._id) === String(id) || String(p.idProducto) === String(id));
    if (prod) {
      const precios = {
        normal: parseFloat(prod.precioNormal || prod.precioVenta || prod.precio || 0),
        minimo: parseFloat(prod.precioMinimo || prod.precioNormal || prod.precioVenta || prod.precio || 0),
        paquete: parseFloat(prod.precioPaquete || prod.precioNormal || prod.precioVenta || prod.precio || 0),
      };
      setNuevoProducto({
        codigo: prod.codigo || prod.idProducto || prod._id,
        nombre: prod.nombreProducto || prod.nombre,
        cantidad: 1,
        tipoPrecio: 'normal',
        precios,
        precio: precios.normal,
      });
    }
  };

  const agregarProducto = () => {
    if (!nuevoProducto.nombre) return;
    setProductos([...productos, nuevoProducto]);
    setNuevoProducto({
      codigo: '',
      nombre: '',
      cantidad: 1,
      precio: 0,
      tipoPrecio: 'normal',
      precios: { normal: 0, minimo: 0, paquete: 0 },
    });
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const subtotal = productos.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  const realizarVenta = async () => {
    if (!cliente.nombre) {
      Swal.fire('Cliente requerido', 'Busque y seleccione un cliente antes de continuar', 'warning');
      return;
    }
    if (productos.length === 0) {
      Swal.fire('Sin productos', 'Agregue al menos un producto a la venta', 'warning');
      return;
    }

    const ventaData = {
      dni,
      cliente: cliente,
      serie,
      correlativo,
      productos,
      totals: { subtotal, igv, total },
    };

    try {
      const pdfBlob = await crearVenta(ventaData);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${correlativo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire('Venta realizada', 'La venta se registró correctamente', 'success');
      onVentaCompletada && onVentaCompletada();
      // Reset form
      setDni('');
      setCliente({ nombre: '', apellido: '' });
      setProductos([]);
      // Obtener nuevo correlativo
      const data = await getCorrelativoVenta();
      setSerie(data.serie);
      setCorrelativo(data.correlativo);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'No se pudo registrar la venta', 'error');
    }
  };

  return (
    <div className="nueva-venta-view">
      <h2>Registrar Venta</h2>

      {/* Información del Cliente */}
      <div className="card cliente-card">
        <h3>Información del Cliente</h3>
        <div className="form-row">
          <label>DNI</label>
          <input value={dni} onChange={(e) => setDni(e.target.value)} maxLength={8} />
          <button className="add-btn" onClick={buscarCliente} disabled={buscandoCliente}>
            <Search size={18} /> Buscar
          </button>
          <label>Nombre</label>
          <input value={cliente.nombre} readOnly />
          <label>Apellido</label>
          <input value={cliente.apellido} readOnly />
        </div>
      </div>

      {/* Información de la Venta */}
      <div className="card venta-card">
        <h3>Información de la Venta</h3>
        <div className="productos-section">
          <h4>Productos</h4>
          <div className="producto-row">
            <select value={nuevoProducto.codigo} onChange={(e) => seleccionarProducto(e.target.value)}>
              <option value="">-- Producto --</option>
              {catalogo.map((p) => (
                <option key={p._id || p.idProducto} value={p._id || p.idProducto}>{p.nombreProducto || p.nombre}</option>
              ))}
            </select>
            <input type="number" placeholder="Cantidad" value={nuevoProducto.cantidad} onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: parseInt(e.target.value) || 1 })} min="1" />
            <select value={nuevoProducto.tipoPrecio} onChange={(e) => {
              const tp = e.target.value;
              setNuevoProducto((prev) => ({
                ...prev,
                tipoPrecio: tp,
                precio: prev.precios[tp] || 0,
              }));
            }}>
              <option value="normal">Precio Normal</option>
              <option value="minimo">Precio Mínimo</option>
              <option value="paquete">Precio Paquete</option>
            </select>
            <input type="number" placeholder="Precio" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: parseFloat(e.target.value) || 0 })} step="0.01" />
            <button className="add-btn" onClick={agregarProducto}><Plus size={18} /></button>
          </div>

          <table className="productos-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>S/ {p.precio.toFixed(2)}</td>
                  <td>S/ {(p.cantidad * p.precio).toFixed(2)}</td>
                  <td><button className="btn-icon" onClick={() => eliminarProducto(idx)}><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="resumen-section">
          <div className="serie-correlativo">
            <label>Serie</label>
            <input value={serie} readOnly />
            <label>Correlativo</label>
            <input value={correlativo} readOnly />
          </div>
          <div className="totales">
            <p>Ope. Gravadas: S/ {subtotal.toFixed(2)}</p>
            <p>IGV (18%): S/ {igv.toFixed(2)}</p>
            <p>Subtotal: S/ {subtotal.toFixed(2)}</p>
            <p><strong>Total: S/ {total.toFixed(2)}</strong></p>
          </div>
          <div className="acciones">
            <button className="save-btn" onClick={realizarVenta}>Realizar Venta</button>
            <button className="cancel-btn" onClick={() => setProductos([])}>Vaciar Listado</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaVentaView;
