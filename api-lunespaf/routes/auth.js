const express = require('express');
const router = express.Router();
const { login, logout, verifyToken, refreshToken, getProfile, changePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.post('/login', login);

// Rutas protegidas (requieren autenticación JWT)
router.post('/logout', authenticateToken, logout);
router.get('/verify', authenticateToken, verifyToken);
router.post('/refresh', authenticateToken, refreshToken);
router.get('/profile', authenticateToken, getProfile);

router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
