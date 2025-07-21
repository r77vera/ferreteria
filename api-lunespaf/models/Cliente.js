const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    id_Cliente: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      comment: 'ID del cliente (DNI o documento)'
    },
    nombreCliente: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Nombre del cliente'
    },
    apellidoCliente: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Apellido del cliente'
    }
  }, {
    tableName: 'tb_cliente',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });

  return Cliente;
};
