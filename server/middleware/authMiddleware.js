const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

const client = (req, res, next) => {
    if (req.user && (req.user.role === 'client' || req.user.role === 'admin')) {
        // Admins should probably have access to client routes too, or strictly separate. 
        // Usually admin has higher privilege, but for now strict checking or allow admin.
        // Let's stick to the specific role check for now, or allow admin to act as client?
        // Requirement says "isClient". Let's assume just checking role.
        // Actually often admin needs to debug. I'll allow admin to pass client checks if it makes sense contextually, 
        // but stricter interpretation is:
        if (req.user.role === 'client') {
            next();
        } else {
            res.status(403).json({ message: 'Not authorized as a client' });
        }
    } else {
        res.status(403).json({ message: 'Not authorized' });
    }
};

// Re-evaluating the "client" middleware. 
// If the goal is "Only Admin can create clients", that uses `admin` middleware.
// "Clients cannot register" -> handled by logic.
// "Customers don't login" -> unrelated to middleware but good metadata.

// Let's refine `client` middleware to strictly check for client role, valid for restaurant owners.
const isClient = (req, res, next) => {
    if (req.user && req.user.role === 'client') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a client' });
    }
}

module.exports = { protect, admin, isClient };
