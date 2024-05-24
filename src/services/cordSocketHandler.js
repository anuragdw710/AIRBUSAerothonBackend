const FlightRepository = require('../repository/flightRepository');
const CordRepository = require('../repository/cordRepository');
const AirportRepository = require('../repository/airportRepository');
const AirplaneRepository = require('../repository/airplaneRepository');

const cordRepo = new CordRepository();
const flightRepo = new FlightRepository();
const airportRepo = new AirportRepository();
const airplaneRepo = new AirplaneRepository();



const cordSocketHandeler = async (io, socket) => {
    const cords = await cordRepo.getAll();
    const flights = await flightRepo.getAll();
    const airport = await airportRepo.getAll();
    const airplane = await airplaneRepo.getNonReservedAirports();
    console.log("plane", airplane);

    socket.emit('initData', { cords, flights, airport, airplane });
    socket.emit("message", "Initial Data Fetch Done!");
    socket.on("changeWeather", async (data) => {
        // console.log(typeof data.x, " ", typeof data.y, " ", typeof data.weather);
        // console.log(data.x, " ", data.y, " ", data.weather);
        // if (!data.x || !data.y || !data.weather) {
        //     socket.emit("error", "Required values are not present");
        //     return;
        // }


        await cordRepo.findOneAndUpdate({ x: data.x, y: data.y }, { "weather": data.weather });
        io.emit("getCord", await cordRepo.getAll());
        socket.emit("changeWeather", "Weather Changed");
        const cordAll = await cordRepo.getAll();
        const flightAll = await flightRepo.getAll();
        socket.emit('globalData', {cordAll,flightAll});
    })
}

module.exports = cordSocketHandeler;