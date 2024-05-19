const AirplaneService = require('../services/airplaneService');

const airplaneService = new AirplaneService();

const createAirplane = async (req, res) => {
    try {

        const response = await airplaneService.create({
            "position": req.body.position,
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
    createAirplane
}