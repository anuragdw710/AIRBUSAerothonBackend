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


}

module.exports = CordRepository;