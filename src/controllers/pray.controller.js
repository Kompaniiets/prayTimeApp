const fetch = require('node-fetch');
const config = require('../config');
const prayTimes = require('../utils/PrayTimes');

const getPrayTime = (async (req, res) => {
    const { lat, lng, dst, gmt } = req.query;
    let times;


    try {
        const response = await fetch(`${config.TIME_API_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await response.json();
        const { dateTime } = data;

        times = prayTimes.getTimes(dateTime, [lat, lng], gmt, dst);
    } catch (err) {
        console.error(err);
    }

    res.json(times);
});

module.exports = {
    getPrayTime
};
