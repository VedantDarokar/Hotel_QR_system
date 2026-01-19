const express = require('express');
const router = express.Router();
const { createTable, getTables, deleteTable } = require('../controllers/tableController');
const { protect, isClient } = require('../middleware/authMiddleware');

router.post('/', protect, isClient, createTable);
router.get('/:restaurantId', protect, isClient, getTables);
router.delete('/:id', protect, isClient, deleteTable);

module.exports = router;
