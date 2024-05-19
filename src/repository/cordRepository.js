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


}

module.exports = CordRepository;