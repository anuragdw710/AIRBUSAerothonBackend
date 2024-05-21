const FlightRepository = require('../repository/flightRepository');
const CordRepository = require('../repository/cordRepository');
const AirplaneRepository = require('../repository/airplaneRepository');
const AirportRepository = require('../repository/airportRepository');
const Cord = require('../models/cord');
const Airplane = require('../models/airplane');
const { astar, createGridFromDatabase } = require('../utiles/astar');



class FlightService {
    constructor() {
        this.flightRepository = new FlightRepository();
        this.cordRepository = new CordRepository();
        this.airplaneRepository = new AirplaneRepository();
        this.airportRepository = new AirportRepository();
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
            const cord = { x: coord.x, y: coord.y };
            reservedCords.push(cord);
        }
        return reservedCords;
    }
    async create(data) {
        try {
            const departureAirport = data.departureAirport;
            const destinationAirport = data.destinationAirport;

            const start = await this.airportRepository.findOne({ "airPortName": departureAirport });
            const goal = await this.airportRepository.findOne({ "airPortName": destinationAirport });

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
                departureAirport: data.departureAirport,
                destinationAirport: data.destinationAirport,
                airPlaneName: data.airPlaneName,
                reserveCord: reservedCords,
                departureTime: new Date(data.departureTime),
                destinationTime: new Date(data.destinationTime)
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
            const flight = await this.flightRepository.findOne({ "flightId": flightId });
            if (!flight) throw new Error('Flight not found');

            const { reserveCord, airPlaneName } = flight;
            let currentIndex = 0;

            const checkWeather = async (coords) => {
                for (const coord of coords) {
                    const cord = await this.cordRepository.findOne({ "x": cord.x, "y": cord.y });
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
                    await this.flightRepository.delete({ "flightId": flightId });
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
                    const currentCoord = await this.cordRepository.findOne(reserveCord[currentIndex]);
                    const goalCoord = await this.airportRepository.findOne({ "airPortName": flight.destinationAirport });
                    const newPath = await findNewPath({ x: currentCoord.x, y: currentCoord.y }, { x: goalCoord.x, y: goalCoord.y });

                    if (newPath.length === 0) {
                        clearInterval(this.runningFlights[flightId]);
                        delete this.runningFlights[flightId];
                        throw new Error('No path found due to bad weather conditions');
                    }

                    const reservedCords = await this.reserveCords(newPath, currentCoord, goalCoord);
                    flight.reserveCord = reservedCords;
                    reserveCord = flight.reserveCord;

                    await flight.save();
                    currentIndex = 0;
                } else {
                    const nextCord = reserveCord[currentIndex];
                    await this.airplaneRepository.findByIdAndUpdate({ "airPlaneName": airPlaneName }, { "x": nextCord.x, "y": nextCord.y });
                    await this.cordRepository.findOneAndUpdate({ "x": nextCord.x, "y": nextCord.y }, { reserve: false });
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