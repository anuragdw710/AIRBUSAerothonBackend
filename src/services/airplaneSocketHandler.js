const AirplaneRepository = require('../repository/airplaneRepository');

const airplaneRepo = new AirplaneRepository();

const airplnaeSocketHandeler = async (io, socket) => {

    socket.emit('getAirPlane', await airplaneRepo.getAll());
}


module.exports = airplnaeSocketHandeler;