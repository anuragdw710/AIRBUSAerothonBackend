const express = require('express');
const CordController = require('../controller/cordController');
const AirportController = require('../controller/airportController');
const AirplaneController = require('../controller/airplaneController');
const FlightController = require('../controller/flightController');

const router = express.Router();

router.post('/cord', CordController.createCord);
router.post('/airport', AirportController.createAirport);
router.post('/airplane', AirplaneController.createAirplane);
router.post('/flight', FlightController.createflight);

router.get('/cord', CordController.getAllCords);
router.get('/flight', FlightController.getAllFlights);

module.exports = router;