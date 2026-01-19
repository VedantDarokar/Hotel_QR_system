const express = require('express');
const router = express.Router();
const { createRestaurant, getAllRestaurants, getMyRestaurants } = require('../controllers/restaurantController');
const { protect, admin, isClient } = require('../middleware/authMiddleware');

router.use(protect);

// Admin Routes
router.post('/', admin, createRestaurant);
router.get('/', admin, getAllRestaurants);

// Client Routes
router.get('/my-restaurants', isClient, getMyRestaurants);


module.exports = router;
