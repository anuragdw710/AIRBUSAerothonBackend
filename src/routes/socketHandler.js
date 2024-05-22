const airportSocketHandler = require('../services/airportSocketHandler');
const cordSocketHandeler = require('../services/cordSocketHandler');
const flightSocketHandler = require('../services/flightSocketHandler');
const airplnaeSocketHandeler = require('../services/airplaneSocketHandler');







const socketHandler = (io) => {

    io.on('connection', async (socket) => {
        console.log(`New client connecte ${socket.id}`);

        airportSocketHandler(io, socket);
        cordSocketHandeler(io, socket);
        flightSocketHandler(io, socket);
        airplnaeSocketHandeler(io, socket);

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });


}

module.exports = socketHandler;