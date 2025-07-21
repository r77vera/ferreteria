const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// CRUD Usuarios - Solo administradores tienen acceso completo
// GET - Solo administradores pueden ver usuarios
router.get('/', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  usuariosController.getAll
);

router.get('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  usuariosController.getById
);

// POST - Solo administradores pueden crear usuarios
router.post('/', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  usuariosController.create
);

// PUT - Solo administradores pueden actualizar usuarios
router.put('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  usuariosController.update
);

// DELETE - Solo administradores pueden eliminar usuarios
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['000', '001']), // Solo Admin y Admin2
  usuariosController.remove
);

module.exports = router;
