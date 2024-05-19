const Airplane = require('../models/airplane');

class AirplaneRepository {
    async create(data) {
        try {
            const response = Airplane.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = AirplaneRepository;