const { model } = require('mongoose');
const AirportRepository = require('../repository/airportRepository');

const airportRepo = new AirportRepository();

const airportSocketHandler = async (io, socket) => {

    socket.emit('getAirports', await airportRepo.getAll());
    socket.emit("message", "Airports Data Fetch Done!");
}

module.exports = airportSocketHandler;