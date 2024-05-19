const Flight = require('../models/flight');

class FlightRepository {
    async create(data) {
        try {
            const response = Flight.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = FlightRepository;