require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false, // Cambiar a console.log para ver las consultas SQL
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Importar todos los modelos
const Cliente = require('./Cliente')(sequelize);
const DetalleVenta = require('./DetalleVenta')(sequelize);
const Empleado = require('./Empleado')(sequelize);
const MarcaProducto = require('./MarcaProducto')(sequelize);
const Pedido = require('./Pedido')(sequelize);
const Producto = require('./Producto')(sequelize);
const TipoEmpleado = require('./TipoEmpleado')(sequelize);
const TipoProducto = require('./TipoProducto')(sequelize);
const Usuario = require('./Usuario')(sequelize);

// Definir asociaciones
const db = {
  sequelize,
  Sequelize,
  Cliente,
  DetalleVenta,
  Empleado,
  MarcaProducto,
  Pedido,
  Producto,
  TipoEmpleado,
  TipoProducto,
  Usuario
};

// Establecer relaciones entre modelos
// Cliente -> Pedido (1:N)
db.Cliente.hasMany(db.Pedido, {
  foreignKey: 'idCliente',
  as: 'pedidos'
});
db.Pedido.belongsTo(db.Cliente, {
  foreignKey: 'idCliente',
  as: 'cliente'
});

// Empleado -> Pedido (1:N)
db.Empleado.hasMany(db.Pedido, {
  foreignKey: 'idEmpleado',
  as: 'pedidos'
});
db.Pedido.belongsTo(db.Empleado, {
  foreignKey: 'idEmpleado',
  as: 'empleado'
});

// TipoEmpleado -> Empleado (1:N)
db.TipoEmpleado.hasMany(db.Empleado, {
  foreignKey: 'idTipoEmpleado',
  as: 'empleados'
});
db.Empleado.belongsTo(db.TipoEmpleado, {
  foreignKey: 'idTipoEmpleado',
  as: 'tipoEmpleado'
});

// MarcaProducto -> Producto (1:N)
db.MarcaProducto.hasMany(db.Producto, {
  foreignKey: 'idMarca',
  as: 'productos'
});
db.Producto.belongsTo(db.MarcaProducto, {
  foreignKey: 'idMarca',
  as: 'marca'
});

// TipoProducto -> Producto (1:N)
db.TipoProducto.hasMany(db.Producto, {
  foreignKey: 'idTipoProducto',
  as: 'productos'
});
db.Producto.belongsTo(db.TipoProducto, {
  foreignKey: 'idTipoProducto',
  as: 'tipoProducto'
});

// Pedido -> DetalleVenta (1:N)
db.Pedido.hasMany(db.DetalleVenta, {
  foreignKey: 'idPedido',
  sourceKey: 'idPedido', // Añadido para especificar la clave de origen
  as: 'detalles'
});
db.DetalleVenta.belongsTo(db.Pedido, {
  foreignKey: 'idPedido',
  as: 'pedido'
});

// Producto -> DetalleVenta (1:N)
db.Producto.hasMany(db.DetalleVenta, {
  foreignKey: 'idProducto',
  as: 'detallesVenta'
});
db.DetalleVenta.belongsTo(db.Producto, {
  foreignKey: 'idProducto',
  as: 'producto'
});

// Usuario -> Empleado (1:1)
db.Usuario.belongsTo(db.Empleado, {
  foreignKey: 'Usuario',
  targetKey: 'idEmpleado',
  as: 'empleado'
});
db.Empleado.hasOne(db.Usuario, {
  foreignKey: 'Usuario',
  sourceKey: 'idEmpleado',
  as: 'usuario'
});

module.exports = db;
