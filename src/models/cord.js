const mongoose = require('mongoose');

const cordSchema = new mongoose.Schema({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    }
}, { timestamps: true });

cordSchema.index({ x: 1, y: 1 }, { unique: true });

const Cord = mongoose.model('Cord', cordSchema);
module.exports = Cord;
