const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://dbUser:abcd1234@cluster0.of7edmv.mongodb.net/';
const connect = async () => {
    await mongoose.connect(MONGO_URL);
}

module.exports = connect;