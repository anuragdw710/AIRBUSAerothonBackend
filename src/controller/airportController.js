const AirportService = require('../services/airportService');

const airportService = new AirportService();

const createAirport = async (req, res) => {
    try {

        const response = await airportService.create({
            "airportCord": req.body.airportCord,
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


module.exports = {
    createAirport
}