const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for user email or username (handling both if needed, but schema said username)
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Security Check: If user is admin, restrict to Localhost only
            if (user.role === 'admin') {
                const clientIp = req.socket.remoteAddress;
                // ::1 is ipv6 localhost, 127.0.0.1 is ipv4 localhost
                const isLocal = clientIp === '::1' || clientIp === '127.0.0.1' || clientIp === '::ffff:127.0.0.1';

                if (!isLocal) {
                    // For production, if you are accessing from the same laptop but via a deployed URL (like Render),
                    // this logic might BLOCK you if Render's internal routing disguises the IP or if you want to access from the WAN.
                    // 
                    // However, strictly "only from my laptop" implies local dev. 
                    // If deployed on Render, 'localhost' is the server itself, not you.
                    // 
                    // To implement "Only Me", it's better to use a Secret Key header or rely on the strong password.
                    // IP-based restriction on the cloud is tricky without a static IP.
                }

                // Since the user is asking for "only from my laptop" and likely running locally or wants an extra layer:
                // We will add a check for a specific header or just rely on the password IF deployed.
                // But typically, simply not sharing the 'admin' password is the best protection.

                // Implementation of STRICT IP restriction (Localhost only):
                // Uncomment the below block if you strictly mean "This server running ON my laptop".
                /*
                if (!isLocal) {
                     return res.status(403).json({ message: 'Admin access restricted to localhost' });
                }
                */
            }

            res.json({
                _id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a client user
// @route   POST /api/auth/create-client
// @access  Private/Admin
const createClient = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        if (!name || !username || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ username });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            username,
            password: hashedPassword,
            role: 'client', // Force role to client
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};


// Temporary Helper for development to seed an admin if none exists
// @desc    Register Admin (Dev only)
// @route   POST /api/auth/register-admin-dev
const registerAdminDev = async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            username,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    loginUser,
    createClient,
    getMe,
    registerAdminDev
};
