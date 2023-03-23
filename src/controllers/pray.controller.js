const fetch = require('node-fetch');
const config = require('../config');
const prayTimes = require('../utils/PrayTimes');
const constants = require('../constants');
const TimeSlots = require('../helpers/timeSlots.helper');

const getPrayTime = (async (req, res, next) => {
    const { lat, lng, period, dst, method, format, year } = req.query;
    const coordinates = [lat, lng];
    let times;

    try {
        const timeSlots = new TimeSlots();
        const response = await fetch(`${config.TIME_API_URL}?latitude=${lat}&longitude=${lng}`)
        const locationInfo = await response.json();
        const { currentLocalTime, standardUtcOffset: { seconds } } = locationInfo;
        const timezone = seconds / 60 / 60;

        prayTimes.setMethod(method);

        if(period === constants.period.YEAR) {
            times = timeSlots.getYear(year, coordinates, timezone, dst, format);
        } else {
            times = timeSlots.getMonth(currentLocalTime, coordinates, timezone, dst, format);
        }
    } catch (err) {
        return next(err);
    }

    res.json(times);
});

module.exports = {
    getPrayTime
};
