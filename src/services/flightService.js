const FlightRepository = require('../repository/flightRepository');
const CordRepository = require('../repository/cordRepository');
const AirplaneRepository = require('../repository/airplaneRepository');
const Cord = require('../models/cord');
const Airplane = require('../models/airplane');
const { astar, createGridFromDatabase } = require('../utiles/astar');



class FlightService {
    constructor() {
        this.flightRepository = new FlightRepository();
        this.cordRepository = new CordRepository();
        this.AirplaneRepository = new AirplaneRepository();
        this.runningFlights = {};
    }


    async reserveCords(path, start, goal) {
        const reservedCords = [];
        // console.log(path, " ", start, " ", goal);
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
            const { startId, goalId, depTime, planeId, arrTime } = data;

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
            // console.log(path);
            if (path.length === 0) {
                throw "No path found";
            }
            const reservedCords = await this.reserveCords(path, start, goal);
            // console.log(reservedCords);
            const flightData = {
                departureAirport: startId,
                destinationAirport: goalId,
                planeId: planeId,
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
    async startFlight(flightId) {
        try {
            const flight = await this.flightRepository.findOne({ _id: flightId });
            if (!flight) throw new Error('Flight not found');

            const { reserveCord, planeId } = flight;
            let currentIndex = 0;

            const checkWeather = async (coords) => {
                for (const coord of coords) {
                    const cord = await Cord.findById(coord);
                    if (cord.weather !== 'good') return false;
                }
                return true;
            };

            const findNewPath = async (currentCoord, goalCoord) => {
                const cords = await this.cordRepository.getAll();
                const grid = await createGridFromDatabase(cords);
                return astar(currentCoord, goalCoord, grid);
            };

            this.runningFlights[flightId] = setInterval(async () => {
                if (currentIndex >= reserveCord.length) {
                    clearInterval(this.runningFlights[flightId]);
                    delete this.runningFlights[flightId];
                    await this.flightRepository.delete({ _id: flightId });
                    return;
                }

                const nextThreeCords = reserveCord.slice(currentIndex, currentIndex + 3);
                const weatherGood = await checkWeather(nextThreeCords);

                if (!weatherGood) {
                    // Clear reserved cords
                    for (let i = currentIndex; i < reserveCord.length; i++) {
                        await Cord.findByIdAndUpdate(reserveCord[i], { reserve: false });
                    }
                    // Find new path
                    const currentCoord = await Cord.findById(reserveCord[currentIndex]);
                    const goalCoord = await this.cordRepository.findOne({ _id: flight.destinationAirport });
                    const newPath = await findNewPath({ x: currentCoord.x, y: currentCoord.y }, { x: goalCoord.x, y: goalCoord.y });

                    if (newPath.length === 0) {
                        clearInterval(this.runningFlights[flightId]);
                        delete this.runningFlights[flightId];
                        throw new Error('No path found due to bad weather conditions');
                    }

                    const reservedCords = await this.reserveCords(newPath, currentCoord, goalCoord);
                    flight.reserveCord = reservedCords.map(cord => cord._id);
                    reserveCord = flight.reserveCord;

                    await flight.save();
                    currentIndex = 0;
                } else {
                    const nextCord = reserveCord[currentIndex];
                    await Airplane.findByIdAndUpdate(planeId, { position: nextCord });
                    await Cord.findByIdAndUpdate(nextCord, { reserve: false });
                    flight.reserveCord.splice(0, 1);
                    await flight.save();
                    currentIndex++;
                }
            }, 5000);
        } catch (error) {
            throw error;
        }
    }
    async stopFlight(flightId) {
        try {
            if (this.runningFlights[flightId]) {
                clearInterval(this.runningFlights[flightId]);
                delete this.runningFlights[flightId];
            } else {
                throw new Error('Flight is not running');
            }
        } catch (error) {
            throw error;
        }
    }

}
module.exports = FlightService;