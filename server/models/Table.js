const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    tableNumber: {
        type: Number,
        required: true
    },
    qrUrl: {
        type: String,
        required: true
    },
    qrCode: {
        type: String // Stores the Base64 Data URL of the QR image
    }
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
