const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoEmpleado = sequelize.define('TipoEmpleado', {
    idTipoEmpleado: {
      type: DataTypes.STRING(8),
      primaryKey: true,
      allowNull: false,
      comment: 'ID del tipo de empleado'
    },
    nombreTipoEmpleado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Nombre del tipo de empleado'
    }
  }, {
    tableName: 'tb_tipo_empleado',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci'
  });

  return TipoEmpleado;
};
