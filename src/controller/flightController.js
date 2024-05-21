const FlightService = require('../services/flightService');

const flightService = new FlightService();

const createflight = async (req, res) => {
    try {

        const response = await flightService.create({
            "departureAirport": req.body.departureAirport,
            "destinationAirport": req.body.destinationAirport,
            "airPlaneName": req.body.airPlaneName,
            "departureTime": req.body.departureTime,
            "destinationTime": req.body.destinationTime,

        });
        return res.status(200).json({
            "isSuccess": true,
            "response": response
        })
    } catch (error) {
        return res.status(500).json({
            "isSuccess": false,
            "response": {},
            err: error
        })
    }


}

const getAllFlights = async (req, res) => {
    try {
        const response = await flightService.getAll();
        return res.status(200).json({
            isSuccess: true,
            response: response
        });
    } catch (error) {
        return res.status(500).json({
            isSuccess: false,
            response: {},
            err: error
        });
    }
};
const startFlight = async (req, res) => {
    try {
        // console.log(req.body.flightId);
        await flightService.startFlight(req.body.flightId);
        return res.status(200).send({ message: 'Flight started' });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};

const stopFlight = async (req, res) => {
    try {
        await flightService.stopFlight(req.body.flightId);
        res.status(200).send({ message: 'Flight stopped' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    createflight,
    getAllFlights,
    startFlight,
    stopFlight
}