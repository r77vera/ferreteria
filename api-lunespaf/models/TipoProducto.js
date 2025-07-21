const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoProducto = sequelize.define('TipoProducto', {
    idTipoProducto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID del tipo de producto'
    },
    nombretipoProducto: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Nombre del tipo de producto'
    }
  }, {
    tableName: 'tb_tipo_producto',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });

  return TipoProducto;
};
