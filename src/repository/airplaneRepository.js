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
    async findByIdAndUpdate(id, data) {
        try {
            await Airplane.findByIdAndUpdate(id, data);
        } catch (error) {
            throw error;
        }
    }


}

module.exports = AirplaneRepository;