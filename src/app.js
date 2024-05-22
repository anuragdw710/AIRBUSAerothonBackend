const express = require('express');
const bodyParser = require('body-parser');


const connect = require('./dbConfig/dbConfig');
const apiRoutes = require('./routes/index');
const Cord = require('./models/cord');
const Airport = require('./models/airport');
const Flight = require('./models/flight');

const startWeatherUpdateProcess = require('./utiles/randomweather');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);


app.listen(3000, async () => {
    console.log('Server started at 3000');
    await connect();
    startWeatherUpdateProcess();
    // await Cord.updateMany({},
    //     {
    //         reserve: false,
    //         weather: "good"
    //     }
    // )
    // for (let i = 0; i < 20; i++) {
    //     for (let j = 0; j < 20; j++) {
    //         await Cord.create({ x: i, y: j });
    //     }
    // }
    // await Cord.deleteMany({})
    console.log('Db connected');
})