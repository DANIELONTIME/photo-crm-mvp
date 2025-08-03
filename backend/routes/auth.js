const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../src/middleware/auth');

const router = express.Router();

// Rotas públicas (não precisam de login)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rotas protegidas (precisam de login)
router.get('/profile', authMiddleware, authController.profile);

// Verificar se token é válido
router.get('/verify', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    data: {
      user: req.user.toSafeObject()
    }
  });
});

module.exports = router;
