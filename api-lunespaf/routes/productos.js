const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');

// Productos CRUD con protección JWT y roles
// GET - Acceso público con información opcional del usuario
router.get('/', optionalAuth, productosController.getAll);
router.get('/:id', optionalAuth, productosController.getById);

// POST - Solo administradores y vendedores pueden crear productos
router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  productosController.create
);

// PUT - Solo administradores y vendedores pueden actualizar productos
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  productosController.update
);

// DELETE - Solo administradores pueden eliminar productos
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  productosController.remove
);

module.exports = router;
