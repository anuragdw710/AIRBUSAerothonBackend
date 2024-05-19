const FlightService = require('../services/flightService');

const flightService = new FlightService();

const createflight = async (req, res) => {
    try {

        const response = await flightService.create({
            "departureAirport": req.body.departureAirport,
            "destinationAirport": req.body.destinationAirport,
            "reserveCord": req.body.reserveCord
        }
        );
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


module.exports = {
    createflight,
    getAllFlights
}