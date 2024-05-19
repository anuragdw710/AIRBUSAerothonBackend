const mongoose = require('mongoose');

const MONGO_URL = 'mongodb://127.0.0.1:27017/aerothon';
const connect = async () => {
    await mongoose.connect(MONGO_URL);
}

module.exports = connect;