const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MarcaProducto = sequelize.define('MarcaProducto', {
    idMarca: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID de la marca'
    },
    nombreMarca: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Nombre de la marca'
    }
  }, {
    tableName: 'tb_marca_producto',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });

  return MarcaProducto;
};
