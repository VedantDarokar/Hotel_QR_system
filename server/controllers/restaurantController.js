const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

// @desc    Create a new restaurant (Assign to client)
// @route   POST /api/restaurants
// @access  Private/Admin
const createRestaurant = async (req, res) => {
    const { name, address, ownerId } = req.body;

    try {
        // Validate owner
        const owner = await User.findById(ownerId);
        if (!owner) {
            return res.status(404).json({ message: 'Owner (Client) not found' });
        }
        if (owner.role !== 'client') {
            return res.status(400).json({ message: 'Owner must be a client' });
        }

        const restaurant = await Restaurant.create({
            name,
            address,
            ownerId
        });

        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all restaurants (Admin view)
// @route   GET /api/restaurants
// @access  Private/Admin
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('ownerId', 'name username email');
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get restaurants by Owner (Client view) - Just for future use or verification
// @route   GET /api/restaurants/my-restaurants
// @access  Private/Client
const getMyRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ ownerId: req.user.id });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRestaurant,
    getAllRestaurants,
    getMyRestaurants
};
