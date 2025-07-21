const express = require('express');
const router = express.Router();
const tiposProductoController = require('../controllers/tiposProductoController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');

// Rutas de Tipos de Producto con protección JWT
// GET - Acceso público para consultar tipos
router.get('/', optionalAuth, tiposProductoController.getAll);
router.get('/:id', optionalAuth, tiposProductoController.getById);

// POST/PUT/DELETE - Solo administradores y vendedores
router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  tiposProductoController.create
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  tiposProductoController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  tiposProductoController.remove
);

module.exports = router;
