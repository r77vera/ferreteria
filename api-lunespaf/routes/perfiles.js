const express = require('express');
const router = express.Router();
const perfilesController = require('../controllers/perfilesController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Rutas de Perfiles (Tipos de Empleado) con protección JWT
// Solo administradores pueden gestionar perfiles
router.get('/', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  perfilesController.getAll
);

router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  perfilesController.getById
);

router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  perfilesController.create
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  perfilesController.update
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  perfilesController.remove
);

module.exports = router;
