const { Pedido, DetalleVenta, Producto, Cliente } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const PDFDocument = require('pdfkit');

// Handlers aún no implementados completamente pero necesarios para las rutas
exports.getAll = (req, res) => res.status(501).json({ error: 'getAll no implementado' });
exports.getById = (req, res) => res.status(501).json({ error: 'getById no implementado' });
exports.update = (req, res) => res.status(501).json({ error: 'update no implementado' });
exports.remove = (req, res) => res.status(501).json({ error: 'remove no implementado' });


// Obtiene la siguiente serie y correlativo "VNT-XX"
exports.getCorrelativo = async (req, res) => {
  try {
    const lastPedido = await Pedido.findOne({
      attributes: ['Correlativo'],
      where: {
        Correlativo: { [Op.like]: 'VNT-%' },
      },
      order: [['idPedido', 'DESC']],
    });

    let nextNumber = 1;
    if (lastPedido && lastPedido.Correlativo) {
      const parts = lastPedido.Correlativo.split('-');
      const num = parseInt(parts[1], 10);
      if (!isNaN(num)) nextNumber = num + 1;
    }

    const correlativo = `VNT-${nextNumber}`;
    const serie = 'VNT';

    return res.json({ serie, correlativo });
  } catch (err) {
    console.error('Error al obtener correlativo:', err);
    return res.status(500).json({ error: 'Error al obtener correlativo' });
  }
};

// Registra la venta y devuelve un PDF (simplificado)
exports.crearVenta = async (req, res) => {
  try {
    const { dni, cliente, productos, totals, metodoPago = 'EFECTIVO' } = req.body;

    // Asegurar existencia del cliente
    let clienteDB = null;
    if (dni) {
      clienteDB = await Cliente.findByPk(dni);
      if (!clienteDB) {
        clienteDB = await Cliente.create({
          id_Cliente: dni,
          nombreCliente: cliente?.nombre || cliente?.nombreCliente || '',
          apellidoCliente: cliente?.apellido || cliente?.apellidoCliente || '',
          telefonoCliente: cliente?.telefono || null,
          direccionCliente: cliente?.direccion || null,
        });
      }
    }

    // 1. Obtener correlativo
    const { serie, correlativo } = await (async () => {
      const lastPedido = await Pedido.findOne({
        attributes: ['Correlativo'],
        where: { Correlativo: { [Op.like]: 'VNT-%' } },
        order: [['idPedido', 'DESC']],
      });
      let nextNumber = 1;
      if (lastPedido && lastPedido.Correlativo) {
        const parts = lastPedido.Correlativo.split('-');
        const num = parseInt(parts[1], 10);
        if (!isNaN(num)) nextNumber = num + 1;
      }
      return { serie: 'VNT', correlativo: `VNT-${nextNumber}` };
    })();

    // 2. Crear registro en Pedido
    const now = new Date();
    const nuevoPedido = await Pedido.create({
      Correlativo: correlativo,
      idCliente: dni || cliente?.dni || null,
      Fecha: now.toISOString().slice(0,10),
      Hora: now.toTimeString().slice(0,8),
      metodoPago: metodoPago,
      opGravda: totals.subtotal,
      igv: totals.igv,
      Total: totals.total,
      // idEmpleado se obtiene del token (ejemplo)
      Conformidad: 'CONFORME',
      montoRecibido: totals.montoRecibido || totals.total,
      vuelto: totals.vuelto || 0,
      idEmpleado: req.user?.empleado?.idEmpleado || null,
    });

    // 3. Crear detalles
    for (const p of productos) {
      await DetalleVenta.create({
        idPedido: nuevoPedido.idPedido,
        idProducto: p.codigo,
        cantidad: p.cantidad,
        
        
        
        subtotal: p.cantidad * p.precio,
      });
    }

    // 4. Generar PDF simple
    const doc = new PDFDocument();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${correlativo}.pdf`,
      });
      res.send(pdfData);
    });

    doc.fontSize(16).text(`Venta ${correlativo}`);
    doc.text(`Cliente: ${cliente?.nombre || ''} ${cliente?.apellido || ''}`);
    doc.text(`Método de Pago: ${metodoPago}`);
    doc.moveDown();
    productos.forEach((p, idx) => {
      doc.text(`${idx + 1}. ${p.nombre} x${p.cantidad} - S/ ${(p.cantidad * p.precio).toFixed(2)}`);
    });
    doc.moveDown();
    doc.text(`Total: S/ ${totals.total.toFixed(2)}`);
    doc.end();
  } catch (err) {
    console.error('Error creando venta:', err);
    return res.status(500).json({ error: 'Error al crear venta' });
  }
};

// Alias para la ruta POST /ventas
exports.create = exports.crearVenta;
