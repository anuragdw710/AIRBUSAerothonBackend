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
        for (const coord of path) {
            if (!((coord.x == start.x && coord.y == start.y) || (coord.x == goal.x && coord.y == goal.y))) {
                await Cord.findOneAndUpdate({ x: coord.x, y: coord.y }, { reserve: true });
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

            if (path.length === 0) {
                throw "No path found";
            }

            const reservedCords = await this.reserveCords(path, start, goal);
            const flightData = {
                departureAirport: data.departureAirport,
                destinationAirport: data.destinationAirport,
                airPlaneName: data.airPlaneName,
                reserveCord: reservedCords,
                departureTime: new Date(data.departureTime),
                destinationTime: new Date(data.destinationTime)
            };

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

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startFlight(flightId) {
        try {
            const flight = await this.flightRepository.findOne({ "flightId": flightId });
            if (!flight) throw new Error('Flight not found');

            let { reserveCord, airPlaneName } = flight;

            const checkWeather = async (coords) => {
                for (const coord of coords) {
                    const cord = await this.cordRepository.findOne({ "x": coord.x, "y": coord.y });
                    if (cord.weather !== 'good') return false;
                }
                return true;
            };

            const findNewPath = async (currentCoord, goalCoord) => {
                const cords = await this.cordRepository.getAll();
                const grid = await createGridFromDatabase(cords);
                return astar(currentCoord, goalCoord, grid);
            };

            const flightInterval = async () => {
                try {
                    if (reserveCord.length === 0) {
                        await this.flightRepository.delete({ "flightId": flightId });
                        clearInterval(this.runningFlights[flightId]);
                        delete this.runningFlights[flightId];
                        return;
                    }

                    const nextThreeCords = reserveCord.slice(0, 3);
                    const weatherGood = await checkWeather(nextThreeCords);

                    if (!weatherGood) {
                        console.log('Bad weather conditions');

                        // Clear reserved cords
                        await Promise.all(reserveCord.map(coord =>
                            this.cordRepository.findOneAndUpdate(
                                { "x": coord.x, "y": coord.y },
                                { reserve: false }
                            )
                        ));

                        const currentCoord = reserveCord[0];
                        const goalCoord = reserveCord[reserveCord.length - 1];
                        console.log(currentCoord, 'currentCoord');
                        console.log(goalCoord, 'goalCoord');

                        const newPath = await findNewPath(
                            { x: currentCoord.x, y: currentCoord.y },
                            { x: goalCoord.x, y: goalCoord.y }
                        );

                        console.log(newPath.length, 'newPath');

                        if (newPath.length === 0) {
                            throw new Error('No path found due to bad weather conditions');
                        }

                        reserveCord = await this.reserveCords(newPath, currentCoord, goalCoord);
                        await this.flightRepository.findOneAndUpdate(
                            { "flightId": flightId },
                            { reserveCord }
                        );
                    } else {
                        const nextCord = reserveCord.shift();
                        console.log(nextCord, 'nextCord');

                        await Promise.all([
                            this.airplaneRepository.findOneAndUpdate(
                                { "airPlaneName": airPlaneName },
                                { "x": nextCord.x, "y": nextCord.y }
                            ),
                            this.cordRepository.findOneAndUpdate(
                                { "x": nextCord.x, "y": nextCord.y },
                                { reserve: false }
                            ),
                            this.flightRepository.findOneAndUpdate(
                                { "flightId": flightId },
                                { reserveCord }
                            )
                        ]);
                    }
                } catch (error) {
                    console.error(error);
                    clearInterval(this.runningFlights[flightId]);
                    delete this.runningFlights[flightId];
                }

                await this.delay(5000);
            };

            this.runningFlights[flightId] = setInterval(flightInterval, 5000);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async stopFlight(flightId) {
        try {
            if (this.runningFlights[flightId]) {
                clearInterval(this.runningFlights[flightId]);
                delete this.runningFlights[flightId];
                console.log(`Flight ${flightId} stopped successfully.`);
            } else {
                throw new Error('Flight is not running');
            }
        } catch (error) {
            console.error(`Error stopping flight ${flightId}:`, error);
            throw error;
        }
    }
}

module.exports = FlightService;
