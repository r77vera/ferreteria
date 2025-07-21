const express = require('express');
const router = express.Router();

// Importar controladores legacy
const LegacyAuthController = require('../controllers/legacyAuthController');
const LegacyProductoController = require('../controllers/legacyProductoController');

// Importar middleware de compatibilidad PHP
const { phpAuthCheck, phpRoleCheck } = require('../middleware/phpCompatibilitySimple');

// ==========================================
// RUTAS DE AUTENTICACIÓN LEGACY
// ==========================================

// Login compatible con validar.php
router.post('/auth/login', LegacyAuthController.login);

// Logout compatible con PHP
router.post('/auth/logout', LegacyAuthController.logout);

// Verificar sesión actual
router.get('/auth/session', LegacyAuthController.checkSession);

// ==========================================
// RUTAS DE PRODUCTOS LEGACY
// ==========================================

// Obtener todos los productos (compatible con ProductoModel::getProducto())
router.get('/productos', LegacyProductoController.getProducto);

// Obtener producto por ID
router.get('/productos/:id', LegacyProductoController.obtenerPorId);

// Registrar nuevo producto (compatible con ProductoController::registrar())
router.post('/productos', 
  phpAuthCheck, 
  phpRoleCheck(['000', '001', '002']), // Admin y Vendedor
  LegacyProductoController.registrar
);

// Actualizar producto (compatible con ProductoController::actualizar())
router.put('/productos/:id', 
  phpAuthCheck, 
  phpRoleCheck(['000', '001', '002']), // Admin y Vendedor
  LegacyProductoController.actualizar
);

// Eliminar producto (compatible con ProductoController::eliminar())
router.delete('/productos/:id', 
  phpAuthCheck, 
  phpRoleCheck(['000', '001']), // Solo Admin
  LegacyProductoController.eliminar
);

// ==========================================
// RUTAS DE MARCAS LEGACY
// ==========================================

// Obtener todas las marcas
router.get('/marcas', async (req, res) => {
  try {
    const db = require('../models');
    const marcas = await db.MarcaProducto.findAll({
      order: [['nombreMarca', 'ASC']]
    });
    
    res.phpResponse(marcas);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.phpError('Error al obtener marcas');
  }
});

// ==========================================
// RUTAS DE TIPOS DE PRODUCTO LEGACY
// ==========================================

// Obtener todos los tipos de producto
router.get('/tipos-producto', async (req, res) => {
  try {
    const db = require('../models');
    const tipos = await db.TipoProducto.findAll({
      order: [['nombretipoProducto', 'ASC']]
    });
    
    res.phpResponse(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de producto:', error);
    res.phpError('Error al obtener tipos de producto');
  }
});

// ==========================================
// RUTAS DE USUARIOS LEGACY
// ==========================================

// Obtener todos los usuarios (solo Admin)
router.get('/usuarios', 
  phpAuthCheck, 
  phpRoleCheck(['000', '001']), 
  async (req, res) => {
    try {
      const db = require('../models');
      const usuarios = await db.Usuario.findAll({
        include: [{
          model: db.Empleado,
          as: 'empleado',
          include: [{
            model: db.TipoEmpleado,
            as: 'tipoEmpleado'
          }]
        }],
        order: [['Usuario', 'ASC']]
      });

      // Formatear respuesta compatible con PHP
      const usuariosFormateados = usuarios.map(usuario => ({
        Usuario: usuario.Usuario,
        Contraseña: '***', // No mostrar contraseña
        estado: usuario.estado,
        idEmpleado: usuario.empleado?.idEmpleado,
        nombreEmpleado: usuario.empleado?.nombreEmpleado,
        apellidoEmpleado: usuario.empleado?.apellidoEmpleado,
        idTipoEmpleado: usuario.empleado?.idTipoEmpleado,
        nombreTipoEmpleado: usuario.empleado?.tipoEmpleado?.nombreTipoEmpleado,
        fecha_registro: usuario.empleado?.fecha_registro
      }));

      res.phpResponse(usuariosFormateados);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.phpError('Error al obtener usuarios');
    }
  }
);

// ==========================================
// RUTAS DE VENTAS LEGACY
// ==========================================

// Obtener todas las ventas
router.get('/ventas', 
  phpAuthCheck, 
  async (req, res) => {
    try {
      const db = require('../models');
      const ventas = await db.Pedido.findAll({
        include: [
          {
            model: db.Cliente,
            as: 'cliente',
            attributes: ['id_Cliente', 'nombreCliente', 'apellidoCliente']
          },
          {
            model: db.Empleado,
            as: 'empleado',
            attributes: ['idEmpleado', 'nombreEmpleado', 'apellidoEmpleado']
          }
        ],
        order: [['Fecha', 'DESC']]
      });

      // Formatear respuesta compatible con PHP
      const ventasFormateadas = ventas.map(venta => ({
        idPedido: venta.idPedido,
        Fecha: venta.Fecha,
        Total: venta.Total,
        id_Cliente: venta.id_Cliente,
        nombreCliente: venta.cliente?.nombreCliente,
        apellidoCliente: venta.cliente?.apellidoCliente,
        idEmpleado: venta.idEmpleado,
        nombreEmpleado: venta.empleado?.nombreEmpleado,
        apellidoEmpleado: venta.empleado?.apellidoEmpleado
      }));

      res.phpResponse(ventasFormateadas);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      res.phpError('Error al obtener ventas');
    }
  }
);

module.exports = router;
