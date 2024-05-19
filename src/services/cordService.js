const CordRepository = require('../repository/cordRepository');

class CordService {
    constructor() {
        this.cordRepository = new CordRepository();
    }

    async create(data) {
        try {
            const response = await this.cordRepository.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getAll() {
        try {
            const response = await this.cordRepository.getAll();
            return response;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = CordService;