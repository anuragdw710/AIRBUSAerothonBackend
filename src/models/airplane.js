const mongoose = require('mongoose');
const Cord = require('./cord');

const airplaneSchema = new mongoose.Schema({
    health: {
        type: String,
        default: 'good'
    },
    position: {
        type: Schema.Types.ObjectId,
        ref: 'Cord'
    }
}, { timestamps: true });

const Airplane = mongoose.model('Airplane', airplaneSchema);
module.exports = Airplane;
