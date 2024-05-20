const AirplaneRepository = require('../repository/airplaneRepository');
const AirportRepository = require('../repository/airportRepository');
const CordRepository = require('../repository/cordRepository');
const { astar, createGridFromDatabase } = require('../utiles/astar');

class AirplaneService {
    constructor() {
        this.airplaneRepository = new AirplaneRepository();
        this.airportRepository = new AirportRepository();
        this.cordRepository = new CordRepository();
    }

    async create(data) {
        try {
            const response = await this.airplaneRepository.create(data);
            return response;
        } catch (error) {
            throw error;
        }
    }
    async findNearestAirport(airplaneId) {
        try {
            const airplane = await this.airplaneRepository.findOne({ _id: airplaneId });
            if (!airplane) throw new Error('Airplane not found');

            const airplanePosition = await this.cordRepository.findOne({ _id: airplane.position });
            if (!airplanePosition) throw new Error('Airplane position not found');

            const airports = await this.airportRepository.getAll();
            const cords = await this.cordRepository.getAll();
            const grid = await createGridFromDatabase(cords);

            let nearestAirport = null;
            let shortestPath = [];

            for (const airport of airports) {
                const airportCord = await this.cordRepository.findOne({ _id: airport.airportCord });
                if (!airportCord) continue;

                const path = astar({ x: airplanePosition.x, y: airplanePosition.y }, { x: airportCord.x, y: airportCord.y }, grid);

                if (!shortestPath.length || (path.length && path.length < shortestPath.length)) {
                    shortestPath = path;
                    nearestAirport = airport;
                }
            }

            return {
                nearestAirport,
                path: shortestPath
            };
        } catch (error) {
            throw error;
        }
    }
}
module.exports = AirplaneService;