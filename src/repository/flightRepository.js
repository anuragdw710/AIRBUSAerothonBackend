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
    async getAll() {
        try {
            const response = await Flight.find({}).populate('reserveCord');
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findOne(query) {
        try {
            const response = await Flight.findOne(query).populate('reserveCord');
            return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = FlightRepository;