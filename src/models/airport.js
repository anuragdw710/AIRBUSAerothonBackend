const mongoose = require('mongoose');
const Cord = require('./cord');

const airportSchema = new mongoose.Schema({
    airportCord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cord'
    }
}, { timestamps: true });

const Airport = mongoose.model('Airport', airportSchema);
module.exports = Airport;
