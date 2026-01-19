const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, updateOrderStatus, generateBill, downloadBillPDF } = require('../controllers/orderController');
const { protect, isClient } = require('../middleware/authMiddleware');

router.post('/', placeOrder); // Public for customers
router.get('/:restaurantId', protect, isClient, getOrders);
router.put('/:id', protect, isClient, updateOrderStatus);
router.get('/:id/bill', generateBill);
router.get('/:id/bill-pdf', downloadBillPDF);
router.delete('/:id', protect, isClient, require('../controllers/orderController').deleteOrder);

module.exports = router;
