const CordService = require('../services/cordService');

const cordService = new CordService();

const createCord = async (req, res) => {
    try {

        const response = await cordService.create({
            "x": req.body.x,
            "y": req.body.y,
            "weather": req.body.weather,
            "reserve": req.body.reserve
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
    createCord
}