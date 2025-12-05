const express = require('express');
const router = express.Router();
const syncController = require('../controllers/syncController');
const authMiddleware = require('../middleware/auth');

router.post('/trigger', authMiddleware, syncController.syncAll);
router.get('/logs', authMiddleware, syncController.getSyncLogs);

module.exports = router;