const express = require('express');
const router = express.Router();
const { getAllClients, updateClientStatus, resetClientPassword } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.get('/clients', getAllClients);
router.put('/clients/:id/status', updateClientStatus);
router.put('/clients/:id/password', resetClientPassword);

module.exports = router;
