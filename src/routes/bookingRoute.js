const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /booking - Bir araba için rezervasyon yapma
router.post('/bookCar', bookingController.bookCar);

router.delete('/cancelBooking', bookingController.cancelBooking);

router.get('/getBooking', bookingController.getBooking);

module.exports = router;
