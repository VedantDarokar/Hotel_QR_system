const express = require('express');
const router = express.Router();
const { createCategory, getCategories } = require('../controllers/categoryController');
const { protect, isClient } = require('../middleware/authMiddleware');

router.post('/', protect, isClient, createCategory);
router.get('/:restaurantId', getCategories); // Public for menu viewing, but likely protected context in dashboard? 
// Actually menu viewing is public for customers.

module.exports = router;
