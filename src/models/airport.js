const mongoose = require('mongoose');
const Cord = require('./cord');

const airportSchema = new mongoose.Schema({
    airPortName: {
        type: String,
        require: true,
        unique: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Airport = mongoose.model('Airport', airportSchema);
module.exports = Airport;
