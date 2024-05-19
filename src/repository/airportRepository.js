const Airport = require('../models/airport');

class AirportRepository {
    async create(data) {
        try {
            const response = Airport.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = AirportRepository;