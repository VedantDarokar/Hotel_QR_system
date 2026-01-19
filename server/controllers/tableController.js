const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');
const QRCode = require('qrcode');

// @desc    Create a new table
// @route   POST /api/tables
// @access  Private/Client
const createTable = async (req, res) => {
    const { restaurantId, tableNumber } = req.body;

    try {
        const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: req.user.id });
        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Create table first to get ID
        const newTable = new Table({
            restaurantId,
            tableNumber,
            qrUrl: 'pending' 
        });
        
        await newTable.save();

        // Construct the URL using the new _id
        const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const qrContent = `${baseUrl}/menu/${restaurantId}/${newTable._id}`;
        
        // Generate QR Code Image (Data URL)
        const qrCodeImage = await QRCode.toDataURL(qrContent);

        // Update table
        newTable.qrUrl = qrContent;
        newTable.qrCode = qrCodeImage;
        await newTable.save();

        res.status(201).json(newTable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tables for a restaurant
// @route   GET /api/tables/:restaurantId
// @access  Private/Client
const getTables = async (req, res) => {
    try {
        const tables = await Table.find({ restaurantId: req.params.restaurantId });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createTable,
    getTables
};
