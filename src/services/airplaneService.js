const AirplaneRepository = require('../repository/airplaneRepository');

class AirplaneService {
    constructor() {
        this.airplaneRepository = new AirplaneRepository();
    }

    async create(data) {
        try {
            const response = await this.airplaneRepository.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AirplaneService;