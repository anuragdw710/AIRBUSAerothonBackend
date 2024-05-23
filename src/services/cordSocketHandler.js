const FlightRepository = require('../repository/flightRepository');
const CordRepository = require('../repository/cordRepository');

const cordRepo = new CordRepository();
const flightRepo = new FlightRepository();



const cordSocketHandeler = async (io, socket) => {
    const cords = await cordRepo.getAll();
    const flights = await flightRepo.getAll();

    socket.emit('initData', { cords, flights });
    socket.emit("message", "Initial Data Fetch Done!");
}

module.exports = cordSocketHandeler;