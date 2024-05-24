const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const Cord = require('./models/cord');
const Airport = require('./models/airport');
const Airplane = require('./models/airplane');

const mongoose = require('mongoose');
const connect = require('./dbConfig/dbConfig');

const startWeatherUpdateProcess = require('./utiles/weatherService');
const socketHandler = require('./routes/socketHandler');

const http = require('http');
const { Server } = require('socket.io');
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
app.set('socketio', io);

const PORT = process.env.PORT || 8000;

server.listen(3000, async () => {
    console.log('Server started at 3000');
    await connect();
    console.log('Db connected');
    socketHandler(io);
    // Cord.updateMany({}, { $set: { reserve: false } })
    //     .then(result => {
    //         console.log(result);
    //     })
    //     .catch(err => {
    //         console.error(err);
    //     });
    // const isAirport = await Airport.find({ "x": 1, "y": 0 });
    // console.log(isAirport.length);

    startWeatherUpdateProcess(io);
});