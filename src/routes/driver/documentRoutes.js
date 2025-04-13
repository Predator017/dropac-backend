const express = require('express');
const router = express.Router();
const multer = require('multer');
const documentController = require('../../controllers/driver/documentController');
const authMiddleware = require('../../middlewares/authMiddleware');


// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit upload size to 5MB
});


router.post('/upload-image',authMiddleware, upload.single('image'), documentController.uploadImage);
router.get('/file/:id', documentController.getImage);



module.exports = router;
