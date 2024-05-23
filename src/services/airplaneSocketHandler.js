const AirplaneRepository = require('../repository/airplaneRepository');

const airplaneRepo = new AirplaneRepository();

const airplnaeSocketHandeler = async (io, socket) => {

    socket.emit('getAirPlane', await airplaneRepo.getAll());
    socket.emit("message", "Airplanes Data Fetch Done!");
}


module.exports = airplnaeSocketHandeler;