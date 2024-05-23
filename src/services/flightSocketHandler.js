const FlightRepository = require('../repository/flightRepository');
const AirportRepository = require('../repository/airportRepository');
const CordRepository = require('../repository/cordRepository');
const { dijkstra, createGridFromDatabase, reserveCords } = require('../utiles/dijkstra');

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
                socket.emit('warn', "Start and goal coordinates are required");
                throw "Start and goal coordinates are required";
            }
            const startCords = { x: start.x, y: start.y };
            const goalCords = { x: goal.x, y: goal.y };
            const cords = await cordRepo.getAll();
            const grid = await createGridFromDatabase(cords);
            console.log(grid);
            const path = dijkstra(startCords, goalCords, grid);
            if (path.length === 0) {
                socket.emit('warn', "No Path found");
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
        if (!flightId) {
            socket.emit('warn', "Flight Id is not present");
            return;
        }
        const flight = await flightRepo.findOne({ "flightId": flightId });
        if (!flight) {
            socket.emit('stopFlight', "stop");
            return;
        }
        if (flight.reserveCord.length == 0) {
            await flightRepo.delete({ "flightId": flightId });
            io.emit('getFlight', await flightRepo.getAll());
            socket.emit('stopFlight', "stop");
            socket.emit('warn', 'Flight reached destination');
            return;
        }
        if (flight.reserveCord.length == 1) {
            await flightRepo.delete({ "flightId": flightId });
            io.emit('getFlight', await flightRepo.getAll());
            socket.emit('message', 'Flight reached destination');
            return;
        }
        const grid = await createGridFromDatabase(cords);
        const currentPos = flight.reserveCord[0];
        const nextThreeCoords = flight.reserveCord.slice(1, 4);

        // Check if the next three points are in good condition
        let pathIsClear = true;
        for (let coord of nextThreeCoords) {
            const currentPos = await cordRepo.findOne({ x: coord.x, y: coord.y });
            if (currentPos.weather != 'good') {
                pathIsClear = false;
                break;
            }
        }

        if (pathIsClear) {
            // Remove the first cord and send the updated reserve cord
            flight.reserveCord.shift();
            await flightRepo.findOneAndUpdate({ "flightId": flightId }, { reserveCord: flight.reserveCord });
            socket.emit('getFlight', await flightRepo.getAll());
            socket.emit('message', `Flight-${flightId} in progress`);
            socket.emit('message', `Path clear: moving from ${currentPos.x}, ${currentPos.y}`);
            io.emit('getFlight', await flightRepo.getAll());
        } else {
            // Find a new path
            const destination = flight.reserveCord[flight.reserveCord.length - 1];
            let newPath = dijkstra(currentPos, destination, grid);

            if (newPath.length > 0) {
                socket.emit('warn', "Weather bad, changing route.....")
                flight.reserveCord = newPath;
                await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
                socket.emit('getFlight', await flightRepo.getAll());
                socket.emit('message', `Flight-${flightId} in progress`);
                socket.emit('message', `Path clear: moving from ${currentPos.x}, ${currentPos.y}`);
                io.emit('getFlight', await flightRepo.getAll());
            } else {
                const airports = await airportRepo.getAll();
                let shortestPath = null;
                let shortestPathLength = Infinity;

                for (let airport of airports) {
                    const airportCoords = { x: airport.x, y: airport.y };
                    const airportGrid = await createGridFromDatabase(cords);
                    newPath = dijkstra(currentPos, airportCoords, airportGrid);

                    if (newPath.length > 0 && newPath.length < shortestPathLength) {
                        shortestPath = newPath;
                        shortestPathLength = newPath.length;
                    }
                }

                if (shortestPath) {
                    const nearestAirport = airports.find(airport => airport.x === shortestPath[shortestPath.length - 1].x && airport.y === shortestPath[shortestPath.length - 1].y);
                    socket.emit('warn', `Weather of the path is not good. Redirecting to nearest airport: ${nearestAirport.airPortName}.`);
                    flight.reserveCord = shortestPath;
                    await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
                    socket.emit('message', `Flight-${flightId} in progress`);
                    socket.emit('message', `Path clear: moving from ${currentPos.x}, ${currentPos.y}`);
                    io.emit('getFlight', await flightRepo.getAll());
                } else {
                    await flightRepo.delete({ "flightId": flightId });
                    io.emit('getFlight', await flightRepo.getAll());
                    socket.emit('warn', 'No path found to any nearby airport! Removing the flight!');
                }
                socket.emit('getFlight', await flightRepo.getAll());
            }
        }
    });
}

module.exports = flightSocketHandler;
