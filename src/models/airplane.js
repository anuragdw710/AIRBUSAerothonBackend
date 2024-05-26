const mongoose = require('mongoose');
const Cord = require('./cord');

const airplaneSchema = new mongoose.Schema({
    airPlaneName: {
        type: String,
        require: true,
        unique: true
    },
    health: {
        type: String,
        default: 'good'
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    reserve: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Airplane = mongoose.model('Airplane', airplaneSchema);
module.exports = Airplane;
