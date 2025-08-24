const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../src/middleware/auth');

router.use(authMiddleware);
router.get('/', eventController.list);
router.post('/', eventController.create);

module.exports = router;
