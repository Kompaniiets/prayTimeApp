const fetch = require('node-fetch');
const config = require('../config');
const prayTimes = require('../utils/PrayTimes');

const getPrayTime = (async (req, res) => {
    const { lat, lng, dst, gmt, method, format } = req.query;
    let times;

    try {
        const response = await fetch(`${config.TIME_API_URL}?latitude=${lat}&longitude=${lng}`)
        const data = await response.json();
        // const { dateTime } = data;
        const { currentLocalTime, standardUtcOffset: { seconds } } = data;
        const timezone = seconds / 60 / 60;

        console.log('FETCHED DATA = ', data);
        console.log('timezone = ', timezone);

        prayTimes.setMethod(method);

        if(method === 'month') {
            times = getMonth(currentLocalTime, lat, lng, timezone, dst, format);
        } else if(method === 'year') {
            // TODO: Add year to params
            times = getYear(2023, lat, lng, timezone, dst, format);
        } else {
            times = prayTimes.getTimes(currentLocalTime, [lat, lng], timezone, dst, format);
        }

    } catch (err) {
        console.error(err);
    }

    res.json(times);
});

function getMonth(date, lat, lng, timezone, dst, timeFormat) {
    const times = [];
    let day = 1;

    // const currentDate = new Date(date);
    const currentDate = new Date();

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const startDate = new Date(year, month, 1);

    const endDate = new Date(year, month + 1, 1);

    const format = timeFormat ? '12hNS' : '24h';

    while (startDate < endDate) {
        const time = prayTimes.getTimes(startDate, [lat, lng], timezone, dst, format);
        time.day = day;

        times.push(time);
        day = day + 1;
        startDate.setDate(startDate.getDate() + 1);  // next day
    }

    return times;
}

function getYear(year, lat, lng, gmt, dst, timeFormat) {
    const times = [];

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    while (startDate < endDate) {
        const time = prayTimes.getTimes(startDate, [lat, lng], gmt, dst, timeFormat);
        times.push(time);
        startDate.setDate(startDate.getDate()+ 1);  // next day
    }

    return times;
}

module.exports = {
    getPrayTime
};
