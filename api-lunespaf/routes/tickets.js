const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Rutas de Tickets con protección JWT
// Todos los roles pueden ver y generar tickets
router.get('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Todos los roles
  ticketsController.getAll
);

router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Todos los roles
  ticketsController.getById
);

router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002', '003']), // Todos los roles
  ticketsController.create
);

// PUT/DELETE - Solo administradores y vendedores
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001', '002']), // Admin, Admin2, Vendedor
  ticketsController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  ticketsController.remove
);

module.exports = router;
