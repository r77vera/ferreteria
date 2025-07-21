# Modelos Sequelize - API LUNESPAF

## Descripción
Este directorio contiene todos los modelos de Sequelize extraídos del esquema SQL de la base de datos `bd_ferreteria`. Los modelos están completamente configurados con sus relaciones y están listos para usar en tu API.

## Estructura de Modelos

### 1. Cliente (`tb_cliente`)
- **Campos**: `id_Cliente`, `nombreCliente`, `apellidoCliente`
- **Relaciones**: Tiene muchos Pedidos (1:N)

### 2. DetalleVenta (`tb_detalle_pedido`)
- **Campos**: `idPedido`, `idProducto`, `cantidad`, `subtotal`
- **Relaciones**: Pertenece a Pedido y Producto

### 3. Empleado (`tb_empleado`)
- **Campos**: `idEmpleado`, `idTipoEmpleado`, `nombreEmpleado`, `apellidoEmpleado`, `imagen`, `estado`, `fecha_registro`, `fecha_edicion`
- **Relaciones**: Pertenece a TipoEmpleado, tiene muchos Pedidos, tiene un Usuario

### 4. MarcaProducto (`tb_marca_producto`)
- **Campos**: `idMarca`, `nombreMarca`
- **Relaciones**: Tiene muchos Productos (1:N)

### 5. Pedido (`tb_pedido`)
- **Campos**: `idPedido`, `Correlativo`, `idCliente`, `Conformidad`, `metodoPago`, `idEmpleado`, `igv`, `opGravda`, `Total`, `montoRecibido`, `vuelto`, `Fecha`, `Hora`
- **Relaciones**: Pertenece a Cliente y Empleado, tiene muchos DetalleVenta

### 6. Producto (`tb_producto`)
- **Campos**: `idProducto`, `idMarca`, `idTipoProducto`, `nombreProducto`, `descripciónProducto`, `precioCompra`, `stock`, `update_adt`, `precioNormal`, `precioMinimo`, `precioPaquete`
- **Relaciones**: Pertenece a MarcaProducto y TipoProducto, tiene muchos DetalleVenta

### 7. TipoEmpleado (`tb_tipo_empleado`)
- **Campos**: `idTipoEmpleado`, `nombreTipoEmpleado`
- **Relaciones**: Tiene muchos Empleados (1:N)

### 8. TipoProducto (`tb_tipo_producto`)
- **Campos**: `idTipoProducto`, `nombretipoProducto`
- **Relaciones**: Tiene muchos Productos (1:N)

### 9. Usuario (`tb_usuario`)
- **Campos**: `id`, `Usuario`, `Contraseña`
- **Relaciones**: Pertenece a Empleado (1:1)

## Instalación y Configuración

### 1. Instalar Sequelize (si no está instalado)
```bash
npm install sequelize mysql2
```

### 2. Configurar variables de entorno
Asegúrate de que tu archivo `.env` contenga:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=bd_ferreteria
```

### 3. Importar los modelos en tu aplicación
```javascript
const db = require('./models');

// Usar los modelos
const clientes = await db.Cliente.findAll();
```

## Uso Básico

### Importar los modelos
```javascript
const db = require('./models');
const { Cliente, Producto, Pedido, DetalleVenta } = db;
```

### Operaciones CRUD básicas

#### Crear un cliente
```javascript
const nuevoCliente = await db.Cliente.create({
  id_Cliente: '12345678',
  nombreCliente: 'Juan',
  apellidoCliente: 'Pérez'
});
```

#### Obtener productos con relaciones
```javascript
const productos = await db.Producto.findAll({
  include: [
    { model: db.MarcaProducto, as: 'marca' },
    { model: db.TipoProducto, as: 'tipoProducto' }
  ]
});
```

#### Crear un pedido con detalles (usando transacciones)
```javascript
const transaction = await db.sequelize.transaction();

try {
  const pedido = await db.Pedido.create({
    Correlativo: 'VNT-001',
    idCliente: '12345678',
    idEmpleado: '70279368',
    // ... otros campos
  }, { transaction });

  await db.DetalleVenta.bulkCreate([
    {
      idPedido: pedido.idPedido,
      idProducto: 194,
      cantidad: 2,
      subtotal: 156.00
    }
  ], { transaction });

  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

## Relaciones Disponibles

### Consultas con relaciones
```javascript
// Pedidos con cliente, empleado y detalles
const pedidosCompletos = await db.Pedido.findAll({
  include: [
    { model: db.Cliente, as: 'cliente' },
    { 
      model: db.Empleado, 
      as: 'empleado',
      include: [{ model: db.TipoEmpleado, as: 'tipoEmpleado' }]
    },
    {
      model: db.DetalleVenta,
      as: 'detalles',
      include: [{
        model: db.Producto,
        as: 'producto',
        include: [
          { model: db.MarcaProducto, as: 'marca' },
          { model: db.TipoProducto, as: 'tipoProducto' }
        ]
      }]
    }
  ]
});
```

## Archivos Incluidos

- `index.js` - Configuración principal y definición de relaciones
- `Cliente.js` - Modelo Cliente
- `DetalleVenta.js` - Modelo DetalleVenta
- `Empleado.js` - Modelo Empleado
- `MarcaProducto.js` - Modelo MarcaProducto
- `Pedido.js` - Modelo Pedido
- `Producto.js` - Modelo Producto
- `TipoEmpleado.js` - Modelo TipoEmpleado
- `TipoProducto.js` - Modelo TipoProducto
- `Usuario.js` - Modelo Usuario
- `sync.js` - Utilidad para sincronizar la base de datos
- `examples.js` - Ejemplos de uso avanzado

## Sincronización de Base de Datos

Para verificar que los modelos están correctamente configurados:
```bash
node models/sync.js
```

## Migración desde MySQL2 a Sequelize

### Antes (MySQL2)
```javascript
const pool = require('./db');
const [rows] = await pool.execute('SELECT * FROM tb_cliente');
```

### Después (Sequelize)
```javascript
const db = require('./models');
const clientes = await db.Cliente.findAll();
```

## Notas Importantes

1. **Transacciones**: Usa transacciones para operaciones que involucren múltiples tablas
2. **Validaciones**: Los modelos incluyen validaciones básicas basadas en el esquema SQL
3. **Índices**: Se mantienen los índices definidos en el esquema original
4. **Charset**: Configurado para `utf8mb4_general_ci` como en la base de datos original

## Ejemplos Avanzados

Consulta el archivo `examples.js` para ver ejemplos más complejos incluyendo:
- Búsquedas con filtros
- Estadísticas de ventas
- Operaciones con transacciones
- Consultas con múltiples relaciones

## Soporte

Los modelos están completamente basados en tu esquema SQL existente y mantienen la compatibilidad con tu estructura de datos actual.
