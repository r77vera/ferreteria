const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Rutas de Ventas con protección JWT y roles
// GET - Administradores y vendedores pueden ver ventas
router.get('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Admin, Admin2, Vendedor, Cajero
  ventasController.getAll
);

router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Admin, Admin2, Vendedor, Cajero
  ventasController.getById
);

// POST - Vendedores y cajeros pueden crear ventas
router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Todos los roles pueden vender
  ventasController.create
);

// PUT - Solo administradores y vendedores pueden modificar ventas
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  ventasController.update
);

// DELETE - Solo administradores pueden eliminar ventas
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  ventasController.remove
);

module.exports = router;
