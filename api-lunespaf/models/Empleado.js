const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Empleado = sequelize.define('Empleado', {
    idEmpleado: {
      type: DataTypes.STRING(8),
      primaryKey: true,
      allowNull: false,
      comment: 'ID del empleado'
    },
    idTipoEmpleado: {
      type: DataTypes.STRING(8),
      allowNull: false,
      references: {
        model: 'tb_tipo_empleado',
        key: 'idTipoEmpleado'
      },
      comment: 'ID del tipo de empleado'
    },
    nombreEmpleado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Nombre del empleado'
    },
    apellidoEmpleado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Apellido del empleado'
    },
    imagen: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'default.png',
      comment: 'Nombre del archivo de imagen'
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: 'Estado del empleado (1=activo, 0=inactivo)'
    },
    fecha_registro: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de registro'
    },
    fecha_edicion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha de última edición'
    }
  }, {
    tableName: 'tb_empleado',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        name: 'Tipo_Empleado',
        fields: ['idTipoEmpleado']
      }
    ]
  });

  return Empleado;
};
