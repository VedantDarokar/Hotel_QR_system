const Category = require('../models/Category');
const Restaurant = require('../models/Restaurant');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Client
const createCategory = async (req, res) => {
    const { name, restaurantId } = req.body;

    try {
        // Verify ownership
        const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: req.user.id });
        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized or restaurant not found' });
        }

        const category = await Category.create({
            name,
            restaurantId
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all categories for a restaurant
// @route   GET /api/categories/:restaurantId
// @access  Public (Menu is public) or Private
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ restaurantId: req.params.restaurantId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Client
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Verify ownership
        const restaurant = await Restaurant.findOne({ _id: category.restaurantId, ownerId: req.user.id });
        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await category.deleteOne();
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    deleteCategory
};
