const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const { authenticateToken } = require('../middleware/auth');

// Proteger todas las rutas de pedidos
router.use(authenticateToken);

// Definir las rutas para los pedidos
router.get('/', pedidosController.getAllPedidos);
router.get('/:id/detalles', pedidosController.getPedidoById);
router.get('/:id/pdf', pedidosController.generatePedidoPDF);

module.exports = router;
