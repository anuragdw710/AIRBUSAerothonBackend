const { model } = require("mongoose");
const Cord = require('../models/cord')

const setAllWeatherToGood = async () => {
    await Cord.updateMany({}, { $set: { weather: 'good' } });
    console.log('All points set to good weather.');
};

async function updateWeatherRandomly() {
    try {
        // Step 1: Find 10 random points with good weather

        const goodWeatherPoints = await Cord.aggregate([
            { $match: { weather: 'good' } },
            { $sample: { size: 10 } }
        ]);

        if (goodWeatherPoints.length === 0) {
            console.log('No points with good weather found.');
            return;
        }

        // Step 2: Update the weather to either "rainy" or "stormy"
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

        // Step 3: Set a timeout to revert the weather back to "good" after 5 minutes
        setTimeout(async () => {
            const revertUpdates = goodWeatherPoints.map(point => {
                return Cord.updateOne(
                    { _id: point._id },
                    { $set: { weather: 'good' } }
                );
            });

            await Promise.all(revertUpdates);
            console.log('Weather reverted back to good for selected points.');

        }, 5 * 60 * 1000); // 5 minutes in milliseconds

    } catch (error) {
        console.error('Error updating weather:', error);
    }
}

const startWeatherUpdateProcess = async () => {
    await setAllWeatherToGood();

    // Run the weather update function every 5 minutes
    setInterval(updateWeatherRandomly, 5 * 60 * 1000);

    // Run the updateWeatherRandomly function immediately on server start
    await updateWeatherRandomly();
};

module.exports = startWeatherUpdateProcess;