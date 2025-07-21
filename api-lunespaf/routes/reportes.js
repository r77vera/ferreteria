const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { Op } = require('sequelize');

// Reporte de ventas por rango de fechas
router.get('/ventas', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin y Vendedor
  async (req, res) => {
    try {
      const { desde, hasta } = req.query;
      if (!desde || !hasta) {
        return res.status(400).json({ error: 'Debe indicar desde y hasta (YYYY-MM-DD)' });
      }

      const ventas = await db.Pedido.findAll({
        where: {
          Fecha: {
            [Op.between]: [desde, hasta]
          }
        },
        include: [
          {
            model: db.Cliente,
            as: 'cliente',
            attributes: ['id_Cliente', 'nombreCliente', 'apellidoCliente']
          },
          {
            model: db.Empleado,
            as: 'empleado',
            attributes: ['idEmpleado', 'nombreEmpleado', 'apellidoEmpleado']
          },
          {
            model: db.DetalleVenta,
            as: 'detalles',
            include: [{
              model: db.Producto,
              as: 'producto',
              attributes: ['idProducto', 'nombreProducto', 'precioNormal']
            }]
          }
        ],
        order: [['Fecha', 'DESC']]
      });

      res.json({
        periodo: { desde, hasta },
        totalVentas: ventas.length,
        montoTotal: ventas.reduce((sum, venta) => sum + parseFloat(venta.Total || 0), 0),
        ventas
      });
    } catch (err) {
      console.error('Error en reporte de ventas:', err);
      res.status(500).json({ error: 'Error al generar reporte de ventas', details: err.message });
    }
  }
);

module.exports = router;
