const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Airplane = require('./airplane');
const Cord = require('./cord'); // Adjust the path as necessary

const flightSchema = new mongoose.Schema({
    flightId: {
        type: Number,
        unique: true
    },
    departureAirport: {
        type: String,
        required: true
    },
    destinationAirport: {
        type: String,
        required: true
    },
    airPlaneName: {
        type: String,
        required: true
    },
    reserveCord: [{
        x: {
            type: Number,
            require: true
        },
        y: {
            type: Number,
            require: true
        }
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

flightSchema.plugin(AutoIncrement, { inc_field: 'flightId' });
const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
