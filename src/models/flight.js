const mongoose = require('mongoose');
const Cord = require('./cord'); // Adjust the path as necessary

const flightSchema = new mongoose.Schema({
    departureAirport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cord',
        required: true
    },
    destinationAirport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cord',
        required: true
    },
    reserveCord: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cord'
    }],
    departureTime: {
        type: Date,
        required: true
    },
    destinationTime: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
