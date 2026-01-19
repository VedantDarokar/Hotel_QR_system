const express = require('express');
const router = express.Router();
const { addMenuItem, getMenuItems, deleteMenuItem } = require('../controllers/menuController');
const { protect, isClient } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});


router.post('/', protect, isClient, upload.single('image'), addMenuItem);
router.get('/:restaurantId', getMenuItems);
router.delete('/:id', protect, isClient, deleteMenuItem);

module.exports = router;
