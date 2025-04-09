const express = require('express');
const router = express.Router();
const geoController = require('../../controllers/driver/geoController');
const authMiddleware = require('../../middlewares/authMiddleware');


router.get('/nearby-drivers',authMiddleware, geoController.getNearbyDrivers);

module.exports = router;