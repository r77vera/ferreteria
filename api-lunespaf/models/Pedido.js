const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    idPedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: 'ID del pedido'
    },
    Correlativo: {
      type: DataTypes.STRING(8),
      allowNull: false,
      comment: 'Número correlativo del pedido'
    },
    idCliente: {
      type: DataTypes.STRING(8),
      allowNull: false,
      references: {
        model: 'tb_cliente',
        key: 'id_Cliente'
      },
      comment: 'ID del cliente'
    },
    Conformidad: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Estado de conformidad del pedido'
    },
    metodoPago: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: 'Método de pago utilizado'
    },
    idEmpleado: {
      type: DataTypes.STRING(8),
      allowNull: false,
      references: {
        model: 'tb_empleado',
        key: 'idEmpleado'
      },
      comment: 'ID del empleado que atendió'
    },
    igv: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Monto del IGV'
    },
    opGravda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Operación gravada'
    },
    Total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Total del pedido'
    },
    montoRecibido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Monto recibido'
    },
    vuelto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      comment: 'Vuelto entregado'
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Fecha del pedido'
    },
    Hora: {
      type: DataTypes.TIME,
      allowNull: false,
      comment: 'Hora del pedido'
    }
  }, {
    tableName: 'tb_pedido',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    indexes: [
      {
        name: 'Pedido_Cliente',
        fields: ['idCliente']
      },
      {
        name: 'Pedido_Empleado',
        fields: ['idEmpleado']
      }
    ]
  });

  return Pedido;
};
