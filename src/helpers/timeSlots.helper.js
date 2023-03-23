const moment = require('moment/moment');
const constants = require('../constants');
const prayTimes = require('../utils/PrayTimes');

class TimeSlotsHelper {
    /**
     * Get time slots for month
     * @param date - current local date
     * @param coordinates - location coordinates
     * @param timezone - location timezone (received from https://timeapi.io)
     * @param dstInterval - object with DST info of location (received from https://timeapi.io)
     * @param timeFormat - time format to display (12h or 24)
     * @returns {*[]}
     */
    getMonth(date, coordinates, timezone, dstInterval, timeFormat) {
        const currentDate = new Date(date);

        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const startDate = new Date(year, month, 1, 0, 0, 0);
        const endDate = new Date(year, month + 1, 1);

        return this.#generateTimeSlots(startDate, endDate, coordinates, timezone, dstInterval, timeFormat);
    }

    /**
     * Get time slots for year
     * @param year - year for generate time slots
     * @param coordinates - location coordinates
     * @param timezone - location timezone (received from https://timeapi.io)
     * @param dstInterval - object with DST info of location (received from https://timeapi.io)
     * @param timeFormat - time format to display (12h or 24)
     * @returns {*[]}
     */
    getYear(year, coordinates, timezone, dstInterval, timeFormat) {
        const currentYear = !year ? new Date().getFullYear() : year;
        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear + 1, 0, 1);

        return this.#generateTimeSlots(startDate, endDate, coordinates, timezone, dstInterval, timeFormat);
    }

    /**
     * Checks if the current date is in DST time
     * @param currentDate - date for check
     * @param dstInterval - object with DST info of location (received from https://timeapi.io)
     * @returns {boolean}
     */
    #checkDstTime(currentDate, dstInterval) {
        if(!dstInterval) {
            return false;
        }

        const { dstStart, dstEnd } = dstInterval;

        const dstStartDate = moment(dstStart).startOf('day');
        const dstEndDate = moment(dstEnd).startOf('day');

        const date = moment(currentDate).startOf('day');
        return date.isBetween(dstStartDate, dstEndDate, null, '[]');
    }

    /**
     * Generate time slots using PrayTimes.js
     * @param startDate - start date of time generation
     * @param endDate - end date of time generation
     * @param coordinates - location coordinates
     * @param timezone - location timezone (received from https://timeapi.io)
     * @param dstInterval - object with DST info of location (received from https://timeapi.io)
     * @param timeFormat - time format to display (12h or 24)
     * @returns {*[]}
     */
    #generateTimeSlots(startDate, endDate, coordinates, timezone, dstInterval, timeFormat) {
        const times = [];
        const format = (!timeFormat || timeFormat === constants.timeFormat.H) ? '12hNS' : '24h';

        let day = 1;

        while (startDate < endDate) {
            // const isDstTime = this.#checkDstTime(startDate, dstInterval);

            let time = prayTimes.getTimes(startDate, coordinates, timezone, 'auto', format);
            time.day = day;

            times.push(time);
            day = day + 1;
            startDate.setDate(startDate.getDate() + 1);  // next day
        }

        return times;
    }
}

module.exports = TimeSlotsHelper;