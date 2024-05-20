const FlightRepository = require('../repository/flightRepository');
const CordRepository = require('../repository/cordRepository');
const Cord = require('../models/cord');
const { astar, createGridFromDatabase } = require('../utiles/astar');



class FlightService {
    constructor() {
        this.flightRepository = new FlightRepository();
        this.cordRepository = new CordRepository();
    }


    async reserveCords(path, start, goal) {
        const reservedCords = [];
        console.log(path, " ", start, " ", goal);
        for (const coord of path) {
            if (
                !(
                    (coord.x == start.x && coord.y == start.y) ||
                    (coord.x == goal.x && coord.y == goal.y)
                )
            ) {
                const cord = await Cord.findOneAndUpdate(
                    { x: coord.x, y: coord.y },
                    { reserve: false }
                );
            }
            const cord = await Cord.findOne({ x: coord.x, y: coord.y });
            reservedCords.push(cord);
        }
        return reservedCords;
    }
    async create(data) {
        try {
            const { startId, goalId, depTime, arrTime } = data;

            const start = await this.cordRepository.findOne({ _id: startId });
            const goal = await this.cordRepository.findOne({ _id: goalId });
            if (!start || !goal) {
                throw "Start and goal coordinates are required";
            }
            const startCords = { x: start.x, y: start.y };
            const goalCords = { x: goal.x, y: goal.y };
            const cords = await this.cordRepository.getAll();
            const grid = await createGridFromDatabase(cords);
            const path = astar(startCords, goalCords, grid);
            console.log(path);
            if (path.length === 0) {
                throw "No path found";
            }
            const reservedCords = await this.reserveCords(path, start, goal);
            // console.log(reservedCords);
            const flightData = {
                departureAirport: startId,
                destinationAirport: goalId,
                reserveCord: reservedCords.map(cord => cord._id), // Assuming reserveCords returns objects with _id field
                departureTime: new Date(depTime),
                destinationTime: new Date(arrTime)
            };
            // console.log(flightData, ' flightData');
            const flight = await this.flightRepository.create(flightData);

            return flight;
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