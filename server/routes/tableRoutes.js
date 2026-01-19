const express = require('express');
const router = express.Router();
const { createTable, getTables } = require('../controllers/tableController');
const { protect, isClient } = require('../middleware/authMiddleware');

router.post('/', protect, isClient, createTable);
router.get('/:restaurantId', protect, isClient, getTables);

module.exports = router;
