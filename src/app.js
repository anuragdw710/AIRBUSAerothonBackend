const express = require('express');
const bodyParser = require('body-parser');


const connect = require('./dbConfig/dbConfig');
const apiRoutes = require('./routes/index');
const Cord = require('./models/cord');
const Airport = require('./models/airport');
const Flight = require('./models/flight');

const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(3000, async () => {
    console.log('Server started at 3000');
    await connect();
    // await Cord.updateMany({},
    //     {
    //         reserve: false,
    //     }
    // )
    console.log('Db connected');
})