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
    async getAll() {
        try {
            const response = await Airport.find({});
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findOne(data) {
        try {
            const response = await Airport.findOne(data);
            return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = AirportRepository;