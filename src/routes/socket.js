
const AirplaneRepository = require('./repositories/airplaneRepository');
const AirportRepository = require('./repositories/airportRepository');
const CordRepository = require('./repositories/cordRepository');
const FlightRepository = require('./repositories/flightRepository');
const { astar, createGridFromDatabase } = require('./pathfinding');

const airplaneRepo = new AirplaneRepository();
const airportRepo = new AirportRepository();
const cordRepo = new CordRepository();
const flightRepo = new FlightRepository();


io.on('connection', async (socket) => {
    console.log('New client connected');

    // Send all cords and flight details to the client
    const cords = await cordRepo.getAll();
    const flights = await flightRepo.getAll();

    socket.emit('initData', { cords, flights });

    // Handle client sending flightId
    // socket.on('getFlightDetails', async (flightId) => {
    //     const flight = await flightRepo.findOne({ flightId });
    //     socket.emit('flightDetails', flight);
    // });

    // Handle client sending flightId with startFlight
    // socket.on('startFlight', async (flightId) => {
    //     const flight = await flightRepo.findOne({ flightId });
    //     const grid = await createGridFromDatabase(cords);
    //     const currentPos = flight.reserveCord[0];
    //     const nextThreeCoords = flight.reserveCord.slice(1, 4);

    //     // Check if the next three points are in good condition
    //     let pathIsClear = true;
    //     for (let coord of nextThreeCoords) {
    //         if (grid[coord.x][coord.y] === 0) {
    //             pathIsClear = false;
    //             break;
    //         }
    //     }

    //     if (pathIsClear) {
    //         // Remove the first cord and send the updated reserve cord
    //         flight.reserveCord.shift();
    //         await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
    //         socket.emit('updatePath', flight.reserveCord);
    //     } else {
    //         // Find a new path
    //         const destination = flight.reserveCord[flight.reserveCord.length - 1];
    //         const newPath = astar(currentPos, destination, grid);

    //         if (newPath.length > 0) {
    //             flight.reserveCord = newPath;
    //             await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
    //             socket.emit('updatePath', flight.reserveCord);
    //         } else {
    //             socket.emit('error', 'No path found');
    //         }
    //     }
    // });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
