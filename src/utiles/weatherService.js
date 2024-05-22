const CordRepository = require('../repository/cordRepository');
const Cord = require('../models/cord');
const cordRepository = new CordRepository();

const setAllWeatherToGood = async () => {
    await cordRepository.getAll().then(cords => {
        cords.forEach(async (cord) => {
            await cordRepository.findOneAndUpdate({ _id: cord._id }, { weather: 'good' });
        });
    });
    console.log('All points set to good weather.');
};

async function updateWeatherRandomly(io) {
    try {
        const goodWeatherPoints = await Cord.aggregate([
            { $match: { weather: 'good' } },
            { $sample: { size: 10 } }
        ]);

        if (goodWeatherPoints.length === 0) {
            console.log('No points with good weather found.');
            return;
        }

        const weatherOptions = ['rainy', 'stormy'];
        const updates = goodWeatherPoints.map(point => {
            const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
            return Cord.updateOne(
                { _id: point._id },
                { $set: { weather: randomWeather } }
            );
        });

        await Promise.all(updates);
        console.log('Weather updated to rainy or stormy for selected points.');

        const updatedCords = await Cord.find({ _id: { $in: goodWeatherPoints.map(p => p._id) } });
        io.emit('weatherUpdate', updatedCords);

        setTimeout(async () => {
            const revertUpdates = goodWeatherPoints.map(point => {
                return Cord.updateOne(
                    { _id: point._id },
                    { $set: { weather: 'good' } }
                );
            });

            await Promise.all(revertUpdates);
            console.log('Weather reverted back to good for selected points.');

            const revertedCords = await Cord.find({ _id: { $in: goodWeatherPoints.map(p => p._id) } });
            io.emit('weatherUpdate', revertedCords);

        }, 60*5000);

    } catch (error) {
        console.error('Error updating weather:', error);
    }
}

const startWeatherUpdateProcess = async (io) => {
    await setAllWeatherToGood();

    setInterval(() => updateWeatherRandomly(io), 60*5000);

    await updateWeatherRandomly(io);
};

module.exports = startWeatherUpdateProcess;
