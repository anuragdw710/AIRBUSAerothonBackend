const Cord = require('../models/cord');

class CordRepository {
    async create(data) {
        try {
            const response = Cord.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getAll() {
        try {
            const response = await Cord.find({});
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findOne(data) {
        try {
            const response = await Cord.findOne(data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async findByIdAndUpdate(id, data) {
        try {
            await Cord.findByIdAndUpdate(id, data);
        } catch (error) {
            throw error;
        }
    }
    async findOneAndUpdate(query, data) {
        try {
            const response = await Cord.findOneAndUpdate(query, data, { new: true })
        } catch (error) {
            throw error;
        }
    }

}

module.exports = CordRepository;