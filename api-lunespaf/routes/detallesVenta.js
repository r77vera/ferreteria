const express = require('express');
const router = express.Router();
const detallesVentaController = require('../controllers/detallesVentaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Rutas de Detalles de Venta con protección JWT
// Todos los roles pueden ver detalles de venta
router.get('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Todos los roles
  detallesVentaController.getAll
);

router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Todos los roles
  detallesVentaController.getById
);

// POST/PUT/DELETE - Solo administradores y vendedores
router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  detallesVentaController.create
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  detallesVentaController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  detallesVentaController.remove
);

module.exports = router;
