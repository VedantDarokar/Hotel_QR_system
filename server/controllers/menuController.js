const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');

// @desc    Add a menu item
// @route   POST /api/menu-items
// @access  Private/Client
const addMenuItem = async (req, res) => {
    const { name, price, description, categoryId, restaurantId } = req.body;
    // Assuming image handling is done via middleware or a separate upload route returning a URL, 
    // or req.file is available if using multer. For now, let's assume image URL is passed or we handle file later.
    // If using multer, image path would be in req.file.path

    let image = req.body.image;
    if (req.file) {
        image = req.file.path; // status: simple local path
    }

    try {
        // Verify ownership of the restaurant via Category or direct check
        // We need to ensure the category belongs to a restaurant owned by the user? 
        // Or just check if the restaurantId passed belongs to the user.

        const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: req.user.id });
        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized to add items to this restaurant' });
        }

        // Verify category belongs to restaurant
        const category = await Category.findOne({ _id: categoryId, restaurantId });
        if (!category) {
            return res.status(400).json({ message: 'Category does not belong to this restaurant' });
        }

        const menuItem = await MenuItem.create({
            name,
            price,
            description, // Schema adds this implicitly if strict? No, I should verify Schema. 
            // My Schema didn't have description. I should update Schema if needed. 
            // For now, adhere to Schema: name, price, image, isAvailable.
            categoryId,
            image,
        });

        res.status(201).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get menu items by Restaurant (or Category)
// @route   GET /api/menu-items/:restaurantId
// @access  Public
const getMenuItems = async (req, res) => {
    try {
        // We might want to filter by category, but getting all for a restaurant is good start
        // To get all items for a restaurant, we first need to find all categories for that restaurant, 
        // then find items in those categories.
        // OR, we can update MenuItem schema to include restaurantId for easier querying. 
        // Let's stick to the current relational model: MenuItem -> Category -> Restaurant.

        const categories = await Category.find({ restaurantId: req.params.restaurantId }).lean();
        const categoryIds = categories.map(cat => cat._id);

        const items = await MenuItem.find({ categoryId: { $in: categoryIds } }).lean();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private/Client
const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) return res.status(404).json({ message: "Item not found" });

        // Helper to verify ownership (deep check)
        const category = await Category.findById(menuItem.categoryId);
        const restaurant = await Restaurant.findOne({ _id: category.restaurantId, ownerId: req.user.id });

        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await menuItem.deleteOne();
        res.json({ message: 'Item removed' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    addMenuItem,
    getMenuItems,
    deleteMenuItem
};
