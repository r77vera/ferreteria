const db = require('./index');

// Función para sincronizar la base de datos
async function syncDatabase() {
  try {
    // Probar la conexión
    await db.sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos (NO usar force: true en producción)
    await db.sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados correctamente.');

    // Mostrar información de las tablas
    console.log('\n📋 Modelos disponibles:');
    Object.keys(db).forEach(modelName => {
      if (modelName !== 'sequelize' && modelName !== 'Sequelize') {
        console.log(`   - ${modelName} -> ${db[modelName].tableName}`);
      }
    });

    console.log('\n🔗 Relaciones establecidas:');
    console.log('   - Cliente (1:N) Pedido');
    console.log('   - Empleado (1:N) Pedido');
    console.log('   - TipoEmpleado (1:N) Empleado');
    console.log('   - MarcaProducto (1:N) Producto');
    console.log('   - TipoProducto (1:N) Producto');
    console.log('   - Pedido (1:N) DetalleVenta');
    console.log('   - Producto (1:N) DetalleVenta');
    console.log('   - Usuario (1:1) Empleado');

  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
  } finally {
    await db.sequelize.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  syncDatabase();
}

module.exports = { syncDatabase };
