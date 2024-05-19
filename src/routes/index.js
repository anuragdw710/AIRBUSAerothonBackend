const express = require('express');
const CordController = require('../controller/cordController');
const AirportController = require('../controller/airportController');

const router = express.Router();

router.post('/cord', CordController.createCord);
router.post('/airport', AirportController.createAirport);

module.exports = router;