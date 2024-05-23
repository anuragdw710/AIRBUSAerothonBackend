const FlightRepository = require('../repository/flightRepository');
const CordRepository = require('../repository/cordRepository');

const cordRepo = new CordRepository();
const flightRepo = new FlightRepository();



const cordSocketHandeler = async (io, socket) => {
    const cords = await cordRepo.getAll();
    const flights = await flightRepo.getAll();

    socket.emit('initData', { cords, flights });
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
    })
}

module.exports = cordSocketHandeler;