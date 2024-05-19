const AirportRepository = require('../repository/airportRepository');

class AirportService {
    constructor() {
        this.airportRepository = new AirportRepository();
    }

    async create(data) {
        try {
            const response = await this.airportRepository.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AirportService;