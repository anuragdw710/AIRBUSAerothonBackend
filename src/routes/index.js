const express = require('express');
const CordController = require('../controller/cordController');
const AirportController = require('../controller/airportController');
const AirplaneController = require('../controller/airplaneController');
const FlightController = require('../controller/flightController');

const router = express.Router();


router.post('/airport', AirportController.createAirport);
router.get('/airPort', AirportController.getAllAirports);

router.post('/airplane', AirplaneController.createAirplane);
router.get('/airplane', AirplaneController.getAllAirPlane);

router.post('/cord', CordController.createCord);
router.get('/cord', CordController.getAllCords);

router.post('/flight', FlightController.createflight);
router.get('/flight', FlightController.getAllFlights);


router.post('/startFlight', FlightController.startFlight);
router.post('/stopFlight', FlightController.stopFlight);

router.get('/findNearestAirport', AirplaneController.findNearestAirport)


module.exports = router;