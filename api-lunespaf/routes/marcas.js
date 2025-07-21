const express = require('express');
const router = express.Router();
const marcasController = require('../controllers/marcasController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');

// Rutas de Marcas con protección JWT
// GET - Acceso público para consultar marcas
router.get('/', optionalAuth, marcasController.getAll);
router.get('/:id', optionalAuth, marcasController.getById);

// POST/PUT/DELETE - Solo administradores y vendedores
router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  marcasController.create
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  marcasController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  marcasController.remove
);

module.exports = router;
