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
    async getAll() {
        try {
            const response = await this.airportRepository.getAll();
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findNearestAirport(x, y) {
        try {
            // const cords = await this.cordRepository.getAll();
            // let nearestAirport = null;
            // let minDistance = Infinity;

            // for (const cord of cords) {
            //     const distance = Math.sqrt(Math.pow(cord.x - x, 2) + Math.pow(cord.y - y, 2));
            //     if (distance < minDistance) {
            //         minDistance = distance;
            //         nearestAirport = cord;
            //     }
            // }

            // if (nearestAirport) {
            //     const airport = await this.airportRepository.findByCordId(nearestAirport._id);
            //     return airport;
            // }

            throw new Error('No airports found');
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AirportService;