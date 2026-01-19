const express = require('express');
const router = express.Router();
const { loginUser, createClient, getMe, registerAdminDev } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/create-client', protect, admin, createClient);
router.get('/me', protect, getMe);

// Dev route to create initials admin
router.post('/register-admin-dev', registerAdminDev);

module.exports = router;
