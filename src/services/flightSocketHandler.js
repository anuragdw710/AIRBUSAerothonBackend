const FlightRepository = require('../repository/flightRepository');
const AirportRepository = require('../repository/airportRepository');
const CordRepository = require('../repository/cordRepository');
const { astar, createGridFromDatabase, reserveCords } = require('../utiles/astar');

const flightRepo = new FlightRepository();
const airportRepo = new AirportRepository();
const cordRepo = new CordRepository();


const flightSocketHandler = async (io, socket) => {
    const cords = await cordRepo.getAll();

    socket.emit('getFlight', await flightRepo.getAll());


    socket.on('getFlightDetails', async (flightId) => {
        const flight = await flightRepo.findOne({ flightId });
        socket.emit('flightDetails', flight);
    });

    socket.on('createFlight', async (data) => {
        try {
            const departureAirport = data.departureAirport;
            const destinationAirport = data.destinationAirport;

            const start = await airportRepo.findOne({ "airPortName": departureAirport });
            const goal = await airportRepo.findOne({ "airPortName": destinationAirport });
            if (!start || !goal) {
                socket.emit('error', "Start and goal coordinates are required");
                throw "Start and goal coordinates are required";
            }
            const startCords = { x: start.x, y: start.y };
            const goalCords = { x: goal.x, y: goal.y };
            const cords = await cordRepo.getAll();
            const grid = await createGridFromDatabase(cords);
            const path = astar(startCords, goalCords, grid);
            if (path.length === 0) {
                socket.emit('error', "No Path found");
                throw "No path found";
            }

            const reservedCords = await reserveCords(path, start, goal);

            const flightData = {
                departureAirport: data.departureAirport,
                destinationAirport: data.destinationAirport,
                airPlaneName: data.airPlaneName,
                reserveCord: reservedCords,
                departureTime: new Date(data.departureTime),
                destinationTime: new Date(data.destinationTime)
            };

            const flight = await flightRepo.create(flightData);
            io.emit('flightCreated', flight);
            socket.emit('message', "Flight Created !");
        } catch (error) {
            socket.emit('error', error.toString());
        }
        io.emit('getFlight', await flightRepo.getAll());
    });


    socket.on('startFlight', async (flightId) => {
        const flight = await flightRepo.findOne({ "flightId": flightId });
        if (!flight) {
            socket.emit('error', 'No flight correspond to id');
            return;
        }
        if (flight.reserveCord.length == 0) {
            await flightRepo.delete({ "flightId": flightId })
            socket.emit('error', 'Flight reach to destination');
            return;
        }
        const grid = await createGridFromDatabase(cords);
        const currentPos = flight.reserveCord[0];
        const nextThreeCoords = flight.reserveCord.slice(1, 4);

        // Check if the next three points are in good condition
        let pathIsClear = true;
        for (let coord of nextThreeCoords) {
            if (grid[coord.x][coord.y] === 0) {
                pathIsClear = false;
                break;
            }
        }

        if (pathIsClear) {
            // Remove the first cord and send the updated reserve cord
            flight.reserveCord.shift();
            await flightRepo.findOneAndUpdate({ "flightId": flightId }, { reserveCord: flight.reserveCord });
            socket.emit('getFlight', await flightRepo.getAll());
            socket.emit(`message', "Path is clear! Flight Move from ${currentPos.x}, ${currentPos.y} !`);
        } else {
            // Find a new path
            const destination = flight.reserveCord[flight.reserveCord.length - 1];
            let newPath = astar(currentPos, destination, grid);

            if (newPath.length > 0) {
                socket.emit('weatherBad', `Weather of the path is not good.So,Changing the route.`)
                flight.reserveCord = newPath;
                await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
                socket.emit('getFlight', await flightRepo.getAll());
                socket.emit(`message', "New path found due to weather condition ! Flight Move from ${currentPos.x}, ${currentPos.y} !`);
            } else {
                const airports = await airportRepo.getAll();
                let foundPath = false;

                for (let airport of airports) {
                    const airportCoords = { x: airport.x, y: airport.y };
                    const airportGrid = await createGridFromDatabase(cords);
                    newPath = astar(currentPos, airportCoords, airportGrid);

                    if (newPath.length > 0) {
                        socket.emit('weatherBad', `Weather of the path is not good. Redirecting to nearest airport: ${airport.airPortName}.`);
                        flight.reserveCord = newPath;
                        await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
                        foundPath = true;
                        socket.emit(`message', "No path found, Moving to nearest Airport! Flight Move from ${currentPos.x}, ${currentPos.y} !`);
                        break;
                    }
                }

                if (!foundPath) {
                    socket.emit('weatherBad', 'No path found to any nearby airport');
                }
            }
            io.emit('getFlight', await flightRepo.getAll());
        }
    });
}

module.exports = flightSocketHandler;