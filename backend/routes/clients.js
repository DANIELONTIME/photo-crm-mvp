const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../src/middleware/auth');

router.use(authMiddleware);
router.get('/', clientController.list);
router.post('/', clientController.create);

module.exports = router;
