const { Producto, Cliente, Pedido, DetalleVenta } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getStats = async (req, res) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  try {
    const totalProducts = await Producto.count();
    const totalClients = await Cliente.count();
    const totalOrders = await Pedido.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysSales = await Pedido.findAll({
      where: {
        Fecha: {
          [Op.gte]: today
        }
      },
      attributes: [
        [fn('SUM', col('Total')), 'totalSales']
      ],
      raw: true
    });

        const salesToday = todaysSales[0].totalSales || 0;

    const monthlySales = await Pedido.findAll({
      where: {
        Fecha: {
          [Op.gte]: twelveMonthsAgo
        }
      },
      attributes: [
        [fn('YEAR', col('Fecha')), 'year'],
        [fn('MONTH', col('Fecha')), 'month'],
        [fn('SUM', col('Total')), 'total']
      ],
      group: ['year', 'month'],
      order: [['year', 'ASC'], ['month', 'ASC']],
      raw: true
    });

    const topProducts = await DetalleVenta.findAll({
      attributes: [
        [fn('SUM', col('cantidad')), 'totalQuantity'],
        [fn('SUM', col('subtotal')), 'totalRevenue']
      ],
      include: [{
        model: Producto,
        as: 'producto',
        attributes: ['nombreProducto']
      }],
      group: ['producto.idProducto', 'producto.nombreProducto'],
      order: [[literal('totalQuantity'), 'DESC']],
      limit: 10,
      raw: true,
      nest: true
    });

    const totalSales = await Pedido.sum('Total');

    const lowStockProducts = await Producto.findAll({
      where: {
        stock: {
          [Op.lt]: 10 // Defining low stock as less than 10 units
        }
      },
      attributes: ['nombreProducto', 'stock', 'precioMinimo'], // Assuming precioMinimo is used for min stock
      order: [['stock', 'ASC']],
      limit: 10,
      raw: true
    });

    const topClients = await Pedido.findAll({
      attributes: [
        [col('cliente.nombreCliente'), 'nombreCliente'],
        [col('cliente.apellidoCliente'), 'apellidoCliente'],
        [fn('COUNT', col('Pedido.idCliente')), 'orderCount']
      ],
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: []
      }],
      group: ['Pedido.idCliente', 'cliente.nombreCliente', 'cliente.apellidoCliente'],
      order: [[literal('orderCount'), 'DESC']],
      limit: 10,
      raw: true
    });

        res.json({
      totalProducts,
      totalClients,
      totalOrders,
      salesToday,
      monthlySales,
      topProducts,
      totalSales,
      lowStockProducts,
      topClients
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching dashboard stats' });
  }
};
