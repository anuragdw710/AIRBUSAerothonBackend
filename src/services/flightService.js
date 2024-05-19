const FlightRepository = require('../repository/flightRepository');

class FlightService {
    constructor() {
        this.flightRepository = new FlightRepository();
    }

    async create(data) {
        try {
            const response = await this.flightRepository.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async getAll() {
        try {
            const response = await this.flightRepository.getAll();
            return response;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = FlightService;