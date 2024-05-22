const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connect = require('./dbConfig/dbConfig');
const startWeatherUpdateProcess = require('./services/weatherService');
const AirplaneRepository = require('./repository/airplaneRepository');
const AirportRepository = require('./repository/airportRepository');
// const CordRepository = require('./repository/cordRepository');
const CordRepository = require('./repository/cordRepository');
const FlightRepository = require('./repository/flightRepository');
const Cord = require('./models/cord');
const { astar, createGridFromDatabase } = require('./utiles/astar');

const airplaneRepo = new AirplaneRepository();
const airportRepo = new AirportRepository();
const cordRepo = new CordRepository();
const flightRepo = new FlightRepository();


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cordRepository = new CordRepository();

// io.on('connection', async (socket) => {
//   console.log('a user connected');

//   const allCords = await cordRepository.getAll();
//   socket.emit('initialCords', allCords);

//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//   });
// });
const reserveCords = async (path, start, goal) => {
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
                { reserve: true }
            );
        }
        const cord = { x: coord.x, y: coord.y };
        reservedCords.push(cord);
    }
    return reservedCords;
}



io.on('connection', async (socket) => {
    console.log('New client connected');

    // Send all cords and flight details to the client
    const cords = await cordRepo.getAll();
    const flights = await flightRepo.getAll();

    socket.emit('initData', { cords, flights });
    // console.log(airplaneRepo.getAll());
    socket.emit('getAirPlane', await airplaneRepo.getAll());
    socket.emit('getAirports', await airportRepo.getAll());
    socket.emit('getFlight', await flightRepo.getAll());
    // Handle client sending flightId
    socket.on('getFlightDetails', async (flightId) => {
        const flight = await flightRepo.findOne({ flightId });
        socket.emit('flightDetails', flight);
    });

    // Handle client sending flightId with startFlight
    socket.on('startFlight', async (flightId) => {
        console.log(flightId);
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
        // console.log(grid);
        const currentPos = flight.reserveCord[0];
        const nextThreeCoords = flight.reserveCord.slice(1, 4);

        // Check if the next three points are in good condition
        let pathIsClear = true;
        for (const coord of nextThreeCoords) {
            const cord = await cordRepo.findOne({ "x": coord.x, "y": coord.y });
            if (cord.weather !== 'good') {
                pathIsClear = false;
                break;
            }
        }

        if (pathIsClear) {
            // Remove the first cord and send the updated reserve cord
            cordRepo.findOneAndUpdate({ "x": currentPos.x, "y": currentPos.y }, { "reserve": false });
            flight.reserveCord.shift();
            await flightRepo.findOneAndUpdate({ "flightId": flightId }, { reserveCord: flight.reserveCord });
            socket.emit('getFlight', await flightRepo.getAll());
        } else {
            // Find a new path
            const destination = flight.reserveCord[flight.reserveCord.length - 1];
            const newPath = astar(currentPos, destination, grid);
            console.log(newPath, currentPos, destination);
            if (newPath.length > 0) {
                flight.reserveCord = newPath;
                await flightRepo.findOneAndUpdate({ flightId }, { reserveCord: flight.reserveCord });
                socket.emit('getFlight', await flightRepo.getAll());
            } else {
                socket.emit('error', 'No path found');
            }
        }
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
        } catch (error) {
            socket.emit('error', error.toString());
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});


app.set('socketio', io);

server.listen(3000, async () => {
    console.log('Server started at 3000');
    await connect();
    console.log('Db connected');

    // startWeatherUpdateProcess(io);
});