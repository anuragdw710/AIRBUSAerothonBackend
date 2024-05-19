const express = require('express');
const CordController = require('../controller/cordController');
const AirportController = require('../controller/airportController');
const AirplaneController = require('../controller/airplaneController');

const router = express.Router();

router.post('/cord', CordController.createCord);
router.post('/airport', AirportController.createAirport);
router.post('/airplane', AirplaneController.createAirplane);

module.exports = router;