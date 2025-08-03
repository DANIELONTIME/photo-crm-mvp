const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../src/middleware/auth');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Rotas CRUD de clientes

// GET /api/clients - Listar clientes do usuário
router.get('/', clientController.list);

// GET /api/clients/stats - Estatísticas dos clientes
router.get('/stats', clientController.stats);

// GET /api/clients/:id - Buscar cliente específico
router.get('/:id', clientController.getById);

// POST /api/clients - Criar novo cliente
router.post('/', clientController.create);

// PUT /api/clients/:id - Atualizar cliente
router.put('/:id', clientController.update);

// DELETE /api/clients/:id - Remover cliente
router.delete('/:id', clientController.delete);

module.exports = router;