const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DetalleVenta = sequelize.define('DetalleVenta', {
    idPedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_pedido',
        key: 'idPedido'
      },
      comment: 'ID del pedido'
    },
    idProducto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tb_producto',
        key: 'idProducto'
      },
      comment: 'ID del producto'
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Cantidad del producto'
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Subtotal del detalle'
    }
  }, {
    tableName: 'tb_detalle_pedido',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        name: 'Pedido_Venta',
        fields: ['idPedido']
      },
      {
        name: 'Pedido_Prodcuto',
        fields: ['idProducto']
      }
    ]
  });

  return DetalleVenta;
};
