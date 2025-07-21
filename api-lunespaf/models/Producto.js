const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Producto = sequelize.define('Producto', {
    idProducto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID del producto'
    },
    idMarca: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tb_marca_producto',
        key: 'idMarca'
      },
      comment: 'ID de la marca del producto'
    },
    idTipoProducto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tb_tipo_producto',
        key: 'idTipoProducto'
      },
      comment: 'ID del tipo de producto'
    },
    nombreProducto: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Nombre del producto'
    },
    descripciónProducto: {
      type: DataTypes.STRING(250),
      allowNull: false,
      comment: 'Descripción del producto'
    },
    precioCompra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio de compra del producto'
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Stock disponible'
    },
    update_adt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de última actualización'
    },
    precioNormal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio normal de venta'
    },
    precioMinimo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Precio mínimo de venta'
    },
    precioPaquete: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Precio por paquete'
    }
  }, {
    tableName: 'tb_producto',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        name: 'Marca_Producto',
        fields: ['idMarca']
      },
      {
        name: 'Tipo_Producto',
        fields: ['idTipoProducto']
      }
    ]
  });

  return Producto;
};
