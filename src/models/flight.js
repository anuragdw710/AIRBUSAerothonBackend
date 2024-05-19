const mongoose = require('mongoose');
const Airport = require('./airport');
const Cord = require('./cord');

const flightSchema = new mongoose.Schema({
    departureAirport: {
        type: Schema.Types.ObjectId,
        ref: 'Airport',
        required: true
    },
    destinationAirport: {
        type: Schema.Types.ObjectId,
        ref: 'Airport',
        required: true
    },
    reserveCord: [{
        type: Schema.Types.ObjectId,
        ref: 'Cord'
    }]
}, { timestamps: true });

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
