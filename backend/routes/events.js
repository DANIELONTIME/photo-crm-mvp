const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../src/middleware/auth');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas especiais (devem vir antes das rotas com parâmetros)
router.get('/stats', eventController.stats);

// Rotas CRUD básicas
router.get('/', eventController.list);
router.get('/:id', eventController.getById);
router.post('/', eventController.create);
router.put('/:id', eventController.update);
router.delete('/:id', eventController.delete);

module.exports = router;