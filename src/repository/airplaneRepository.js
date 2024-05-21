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
    async findOne(id) {
        try {
            const response = await Airplane.findOne(id);
            return response
        } catch (error) {
            throw error;
        }

    }
    async findOneAndUpdate(query, data) {
        try {
            const response = await Airplane.findOneAndUpdate(query, data, { new: true });
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getAll() {
        try {
            const response = await Airplane.find({});
            return response;
        } catch (error) {
            throw error;
        }
    }


}

module.exports = AirplaneRepository;