const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');

router.get('/overview', authMiddleware, analyticsController.getOverview);
router.get('/orders', authMiddleware, analyticsController.getOrdersByDate);
router.get('/top-customers', authMiddleware, analyticsController.getTopCustomers);
router.get('/revenue-trend', authMiddleware, analyticsController.getRevenueTrend);
router.get('/top-products', authMiddleware, analyticsController.getTopProducts);
router.get('/order-status', authMiddleware, analyticsController.getOrderStatus);

module.exports = router;