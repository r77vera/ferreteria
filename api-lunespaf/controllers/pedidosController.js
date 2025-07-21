const { Pedido, Cliente, Empleado, DetalleVenta, Producto } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

// Obtener todos los pedidos con paginación y filtro por fecha
exports.getAllPedidos = async (req, res) => {
  try {
    const { page = 1, limit = 10, fechaInicio, fechaFin } = req.query;
    const offset = (page - 1) * limit;

    let where = {};
    if (fechaInicio && fechaFin) {
      where.Fecha = {
        [Op.between]: [fechaInicio, fechaFin]
      };
    }

    const { count, rows } = await Pedido.findAndCountAll({
      where,
      include: [
        { model: Cliente, as: 'cliente', attributes: ['nombreCliente', 'apellidoCliente'] },
        { model: Empleado, as: 'empleado', attributes: ['nombreEmpleado', 'apellidoEmpleado'] }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['Fecha', 'DESC'], ['Hora', 'DESC']]
    });

    res.json({ total: count, pedidos: rows });
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

// Obtener el detalle de un pedido por ID
exports.getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
        const detalles = await DetalleVenta.findAll({
      attributes: ['idPedido', 'idProducto', 'cantidad', 'subtotal'],
      where: { idPedido: id },
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['nombreProducto', 'descripciónProducto']
        }
      ]
    });

    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ error: 'No se encontraron detalles para el pedido' });
    }

    res.json(detalles);
  } catch (error) {
    console.error('Error fetching pedido details:', error);
    res.status(500).json({ error: 'Error al obtener el detalle del pedido' });
  }
};

// Generar un PDF para un pedido
exports.generatePedidoPDF = async (req, res) => {
    try {
      const { id } = req.params;
      const pedido = await Pedido.findByPk(id, {
        include: [
          { model: Cliente, as: 'cliente' },
          { model: Empleado, as: 'empleado' },
          {
            model: DetalleVenta,
            as: 'detalles',
            include: [{ model: Producto, as: 'producto' }]
          }
        ]
      });
  
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
  
      const doc = new PDFDocument({ margin: 20, size: [230, 800] });
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename=pedido_${pedido.Correlativo}.pdf`);
      doc.pipe(res);
  
      const logoPath = path.join(__dirname, '../../../frontend/src/assets/logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 65, 10, { width: 100 });
      }
  
      doc.moveDown(3);
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Boleta de Venta', { align: 'center' });
  
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Nro: ${pedido.Correlativo}`, { align: 'right' });
  
      doc
        .moveDown()
        .fontSize(9)
        .text(`Fecha: ${new Date(pedido.Fecha).toLocaleDateString('es-PE')}`)
        .text(`Cliente: ${pedido.cliente.nombreCliente} ${pedido.cliente.apellidoCliente}`)
        .text(`Atendido por: ${pedido.empleado.nombreEmpleado} ${pedido.empleado.apellidoEmpleado}`);
  
      doc.moveDown(1).fontSize(9).font('Helvetica-Bold').text('DETALLE DE PRODUCTOS');
      doc.moveTo(20, doc.y + 2).lineTo(210, doc.y + 2).stroke();
  
      // Encabezados tabla
      doc
        .font('Helvetica-Bold')
        .fontSize(8)
        .text('Producto', 20)
        .text('Cant.', 135)
        .text('P.Unit', 165)
        .text('Total', 195, undefined, { align: 'right' });
  
      doc.moveTo(20, doc.y + 2).lineTo(210, doc.y + 2).stroke();
  
      let y = doc.y + 5;
      doc.font('Helvetica').fontSize(8);
  
      pedido.detalles.forEach(detalle => {
        const unitPrice = parseFloat(detalle.subtotal) / detalle.cantidad;
  
        let nombreProducto = detalle.producto.nombreProducto;
        if (nombreProducto.length > 28) {
          nombreProducto = nombreProducto.substring(0, 25) + '...';
        }
  
        doc.text(nombreProducto, 20, y, { width: 110 });
        doc.text(detalle.cantidad.toString(), 135, y, { width: 20, align: 'right' });
        doc.text(unitPrice.toFixed(2), 165, y, { width: 30, align: 'right' });
        doc.text(parseFloat(detalle.subtotal).toFixed(2), 195, y, { width: 35, align: 'right' });
  
        y = doc.y + 5;
        if (y > 700) {
          doc.addPage();
          y = 40;
        }
      });
  
      doc.moveDown(1);
      doc.moveTo(20, doc.y).lineTo(210, doc.y).stroke();
  
      // Subtotales
      doc
        .moveDown(0.5)
        .font('Helvetica')
        .fontSize(9)
        .text(`Subtotal:`, 120, doc.y, { continued: true })
        .text(`S/ ${parseFloat(pedido.opGravda).toFixed(2)}`, { align: 'right' });
  
      doc
        .text(`IGV (18%):`, 120, doc.y, { continued: true })
        .text(`S/ ${parseFloat(pedido.igv).toFixed(2)}`, { align: 'right' });
  
      // TOTAL resaltado
      doc
        .moveDown(0.5)
        .rect(20, doc.y - 2, 190, 20)
        .fillOpacity(0.1)
        .fillAndStroke('#000000', '#000000');
  
      doc
        .fillColor('#ffffff')
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('TOTAL:', 25, doc.y + 2, { continued: true })
        .text(`S/ ${parseFloat(pedido.Total).toFixed(2)}`, { align: 'right' });
  
      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Error al generar el PDF del pedido' });
    }
  };