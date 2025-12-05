const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/auth');

router.get('/status', authMiddleware, tenantController.getStatus);

module.exports = router;