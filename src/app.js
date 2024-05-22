const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');


const connect = require('./dbConfig/dbConfig');
const AirplaneRepository = require('./repository/airplaneRepository');
const AirportRepository = require('./repository/airportRepository');
const CordRepository = require('./repository/cordRepository');
const FlightRepository = require('./repository/flightRepository');
const { astar, createGridFromDatabase } = require('./utiles/astar');

const startWeatherUpdateProcess = require('./utiles/randomweather');

const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use('/api', apiRoutes);

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
    socket.on('getFlightDetails', async (flightId) => {
        const flight = await flightRepo.findOne({ flightId });
        socket.emit('flightDetails', flight);
    });

    // Handle client sending flightId with startFlight
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
            await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
            io.emit('updateFlight', flight);
        } else {
            // Find a new path
            const destination = flight.reserveCord[flight.reserveCord.length - 1];
            const newPath = astar(currentPos, destination, grid);

            if (newPath.length > 0) {
                flight.reserveCord = newPath;
                await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
                io.emit('updateFlight', flight);
            } else {
                socket.emit('error', 'No path found');
            }
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});





app.listen(3000, async () => {
    console.log('Server started at 3000');
    await connect();
    startWeatherUpdateProcess(io);

    console.log('Db connected');
})