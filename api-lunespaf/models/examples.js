const db = require('./index');

// Ejemplos de uso de los modelos Sequelize
class ModelExamples {
  
  // Ejemplo: Obtener todos los clientes
  static async getAllClientes() {
    try {
      const clientes = await db.Cliente.findAll();
      return clientes;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }

  // Ejemplo: Crear un nuevo cliente
  static async createCliente(clienteData) {
    try {
      const cliente = await db.Cliente.create(clienteData);
      return cliente;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  }

  // Ejemplo: Obtener productos con marca y tipo
  static async getProductosConRelaciones() {
    try {
      const productos = await db.Producto.findAll({
        include: [
          {
            model: db.MarcaProducto,
            as: 'marca'
          },
          {
            model: db.TipoProducto,
            as: 'tipoProducto'
          }
        ]
      });
      return productos;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Ejemplo: Obtener pedidos con cliente, empleado y detalles
  static async getPedidosCompletos() {
    try {
      const pedidos = await db.Pedido.findAll({
        include: [
          {
            model: db.Cliente,
            as: 'cliente'
          },
          {
            model: db.Empleado,
            as: 'empleado',
            include: [{
              model: db.TipoEmpleado,
              as: 'tipoEmpleado'
            }]
          },
          {
            model: db.DetalleVenta,
            as: 'detalles',
            include: [{
              model: db.Producto,
              as: 'producto',
              include: [
                {
                  model: db.MarcaProducto,
                  as: 'marca'
                },
                {
                  model: db.TipoProducto,
                  as: 'tipoProducto'
                }
              ]
            }]
          }
        ]
      });
      return pedidos;
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }

  // Ejemplo: Crear un pedido completo con detalles
  static async createPedidoCompleto(pedidoData, detallesData) {
    const transaction = await db.sequelize.transaction();
    
    try {
      // Crear el pedido
      const pedido = await db.Pedido.create(pedidoData, { transaction });
      
      // Crear los detalles del pedido
      const detallesConPedidoId = detallesData.map(detalle => ({
        ...detalle,
        idPedido: pedido.idPedido
      }));
      
      await db.DetalleVenta.bulkCreate(detallesConPedidoId, { transaction });
      
      // Actualizar stock de productos
      for (const detalle of detallesData) {
        await db.Producto.decrement('stock', {
          by: detalle.cantidad,
          where: { idProducto: detalle.idProducto },
          transaction
        });
      }
      
      await transaction.commit();
      return pedido;
    } catch (error) {
      await transaction.rollback();
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  // Ejemplo: Buscar productos por nombre o descripción
  static async searchProductos(searchTerm) {
    try {
      const productos = await db.Producto.findAll({
        where: {
          [db.Sequelize.Op.or]: [
            {
              nombreProducto: {
                [db.Sequelize.Op.like]: `%${searchTerm}%`
              }
            },
            {
              descripciónProducto: {
                [db.Sequelize.Op.like]: `%${searchTerm}%`
              }
            }
          ]
        },
        include: [
          {
            model: db.MarcaProducto,
            as: 'marca'
          },
          {
            model: db.TipoProducto,
            as: 'tipoProducto'
          }
        ]
      });
      return productos;
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  }

  // Ejemplo: Obtener empleados con sus usuarios
  static async getEmpleadosConUsuarios() {
    try {
      const empleados = await db.Empleado.findAll({
        include: [
          {
            model: db.TipoEmpleado,
            as: 'tipoEmpleado'
          },
          {
            model: db.Usuario,
            as: 'usuario'
          }
        ]
      });
      return empleados;
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  }

  // Ejemplo: Estadísticas de ventas
  static async getEstadisticasVentas(fechaInicio, fechaFin) {
    try {
      const estadisticas = await db.Pedido.findAll({
        attributes: [
          [db.sequelize.fn('COUNT', db.sequelize.col('idPedido')), 'totalPedidos'],
          [db.sequelize.fn('SUM', db.sequelize.col('Total')), 'totalVentas'],
          [db.sequelize.fn('AVG', db.sequelize.col('Total')), 'promedioVenta']
        ],
        where: {
          Fecha: {
            [db.Sequelize.Op.between]: [fechaInicio, fechaFin]
          }
        }
      });
      return estadisticas[0];
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

module.exports = ModelExamples;
