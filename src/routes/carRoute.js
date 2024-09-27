const express = require('express');

const router = express.Router();

const carController = require('../controllers/carController');

router.get('/my/:id', carController.getMyCars);

router.get('/:id', carController.getCarById); // Belirli bir araba bilgisini ID ile alır.

router.get('/', carController.getAllCars);

router.post('/', carController.createCar);

router.put('/:id', carController.updateCar);

module.exports = router;
