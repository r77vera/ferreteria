const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { authenticateToken } = require('../middleware/auth');

// Proteger todas las rutas
router.use(authenticateToken);

// GET /api/clientes  (lista o por ?dni=xxxx)
router.get('/', clientesController.getClientes);

module.exports = router;
