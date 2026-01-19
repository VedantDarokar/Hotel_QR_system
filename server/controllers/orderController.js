const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// @desc    Place a new order (Customer)
// @route   POST /api/orders
// @access  Public
const placeOrder = async (req, res) => {
    const { restaurantId, tableId, items, total } = req.body;

    try {
        // Basic validation could go here

        const order = await Order.create({
            restaurantId,
            tableId,
            items,
            total,
            status: 'pending' // Default
        });

        // Socket IO - Notify Restaurant
        const io = req.app.get('socketio');
        // Emit to specific restaurant room
        io.to(restaurantId).emit('new_order', await order.populate('tableId', 'tableNumber'));
        // We populate immediately so frontend gets full info without refresh

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders for a restaurant (Owner)
// @route   GET /api/orders/:restaurantId
// @access  Private/Client
const getOrders = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ _id: req.params.restaurantId, ownerId: req.user.id });
        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const orders = await Order.find({ restaurantId: req.params.restaurantId })
            .populate('tableId', 'tableNumber')
            .populate('items.menuItemId', 'name price')
            .sort({ createdAt: -1 }); // Newest first
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Client
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Verify ownership
        const restaurant = await Restaurant.findOne({ _id: order.restaurantId, ownerId: req.user.id });
        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (status) order.status = status;
        if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

        await order.save();

        // Socket IO - Notify Customer
        const io = req.app.get('socketio');
        // Emit general update for this order room
        io.to(req.params.id).emit('order_status', {
            status: order.status,
            paymentStatus: order.paymentStatus
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Generate Bill (Basically just get the order details + marked as completed/paid if needed)
// @route GET /api/orders/:id/bill
// @access Private/Client or Public
const generateBill = async (req, res) => {
    // This could just return the order details formatted for a bill
    try {
        const order = await Order.findById(req.params.id)
            .populate('tableId', 'tableNumber')
            .populate('items.menuItemId', 'name price');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const PDFDocument = require('pdfkit');

// @desc Generate and Download Bill PDF
// @route GET /api/orders/:id/bill-pdf
// @access Public (or protected based on business logic, keeping public for customer ease)
const downloadBillPDF = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('tableId', 'tableNumber')
            .populate('items.menuItemId', 'name price')
            .populate('restaurantId', 'name address'); // Assuming Restaurant has name & address

        if (!order) return res.status(404).json({ message: 'Order not found' });

        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bill-${order._id}.pdf`);

        doc.pipe(res);

        // Header
        doc.fontSize(20).text(order.restaurantId.name, { align: 'center' });
        doc.fontSize(12).text(order.restaurantId.address, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order #: ${order._id.toString().slice(-6)}`, { align: 'left' });
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'left' });
        doc.text(`Table: ${order.tableId ? order.tableId.tableNumber : 'N/A'}`, { align: 'left' });
        doc.moveDown();

        // Table Header
        const tableTop = 200;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Qty', 280, tableTop);
        doc.text('Price', 350, tableTop);
        doc.text('Total', 450, tableTop);
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Items
        let y = tableTop + 30;
        doc.font('Helvetica');

        let subtotal = 0;

        order.items.forEach(item => {
            const name = item.menuItemId ? item.menuItemId.name : 'Unknown Item';
            const price = item.price;
            const total = price * item.quantity;
            subtotal += total;

            doc.text(name, 50, y);
            doc.text(item.quantity.toString(), 280, y);
            doc.text(price.toFixed(2), 350, y);
            doc.text(total.toFixed(2), 450, y);
            y += 20;
        });

        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 20;

        // Totals
        const taxRate = 0.05;
        const tax = subtotal * taxRate;
        const grandTotal = subtotal + tax;

        doc.font('Helvetica-Bold');
        doc.text('Subtotal:', 350, y);
        doc.text(subtotal.toFixed(2), 450, y);
        y += 20;
        doc.text('Tax (5%):', 350, y);
        doc.text(tax.toFixed(2), 450, y);
        y += 20;
        doc.fontSize(14).text('Grand Total:', 350, y);
        doc.text(grandTotal.toFixed(2), 450, y);

        // Footer
        doc.fontSize(10).font('Helvetica-Oblique');
        doc.text('Thank you for dining with us!', 50, 700, { align: 'center', width: 500 });

        doc.end();

    } catch (error) {
        // If headers already sent (streaming started), we can't send JSON error easily.
        // But if error happens before pipe, we can.
        console.error(error);
        if (!res.headersSent) res.status(500).json({ message: error.message });
    }
}

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Client
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Verify ownership
        const restaurant = await Restaurant.findOne({ _id: order.restaurantId, ownerId: req.user.id });
        if (!restaurant) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await order.deleteOne();
        res.json({ message: 'Order deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    placeOrder,
    getOrders,
    updateOrderStatus,
    generateBill,
    downloadBillPDF,
    deleteOrder
};
