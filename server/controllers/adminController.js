const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');

// @desc    Get all clients
// @route   GET /api/admin/clients
// @access  Private/Admin
const getAllClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' }).select('-password');
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Enable or Disable client
// @route   PUT /api/admin/clients/:id/status
// @access  Private/Admin
const updateClientStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'client') {
            return res.status(400).json({ message: 'Can only update status for clients' });
        }

        user.isActive = req.body.isActive;
        await user.save();

        res.json({ message: `Client status updated to ${user.isActive}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Client Password
// @route   PUT /api/admin/clients/:id/password
// @access  Private/Admin
const resetClientPassword = async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'client') {
            return res.status(400).json({ message: 'Can only reset password for clients' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllClients,
    updateClientStatus,
    resetClientPassword
};
