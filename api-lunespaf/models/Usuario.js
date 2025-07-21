const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID único del usuario'
    },
    Usuario: {
      type: DataTypes.STRING(8),
      allowNull: false,
      unique: true,
      references: {
        model: 'tb_empleado',
        key: 'idEmpleado'
      },
      comment: 'Usuario (referencia al ID del empleado)'
    },
    Contraseña: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Contraseña encriptada del usuario'
    }
  }, {
    tableName: 'tb_usuario',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        name: 'User',
        fields: ['Usuario']
      }
    ]
  });

  return Usuario;
};
