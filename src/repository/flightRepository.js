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
            const response = await Flight.find({});
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findOne(query) {
        try {
            const response = await Flight.findOne(query);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findOneAndUpdate(query, data) {
        try {
            const response = await Flight.findOneAndUpdate(query, data, { new: true });
            return response;
        } catch (error) {
            throw error;
        }
    }
    async delete(query) {
        try {
            const response = await Flight.deleteOne(query);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findOneAndUpdate(query, data) {
        try {
            const response = await Flight.findOneAndUpdate(query, data, { new: true });
            return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = FlightRepository;