const express = require('express');
const router = express.Router();
const marcasController = require('../controllers/marcasController');
const { authenticateToken, authorizeRoles, optionalAuth } = require('../middleware/auth');

// Rutas de Marcas con protección JWT
// GET - Acceso público para consultar marcas
router.get('/', optionalAuth, marcasController.getAllMarcas);
router.get('/:id', optionalAuth, marcasController.getMarcaById);

// POST/PUT/DELETE - Solo administradores y vendedores
router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  marcasController.createMarca
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  marcasController.updateMarca
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  marcasController.deleteMarca
);

module.exports = router;
