const AirplaneService = require('../services/airplaneService');

const airplaneService = new AirplaneService();

const createAirplane = async (req, res) => {
    try {

        const response = await airplaneService.create({
            "airPlaneName": req.body.airPlaneName,
            "x": req.body.x,
            "y": req.body.y
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

const findNearestAirport = async (req, res) => {
    try {
        const response = await airplaneService.findNearestAirport(req.body.airplaneId);
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
const getAllAirPlane = async (req, res) => {
    try {
        const response = await airplaneService.getAll();
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
    createAirplane,
    findNearestAirport,
    getAllAirPlane
}