const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
            required: true
        },
        y: {
            type: Number,
            required: true
        }
    }],
    departureTime: {
        type: String,
        required: true
    }
}, { timestamps: true });

flightSchema.plugin(AutoIncrement, { inc_field: 'flightId' });
const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;
