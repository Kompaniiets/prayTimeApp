const Joi = require('joi');
const { dst, period, method, timeFormat } = require('../constants');

const locationSchema = {
    query: Joi.object().keys({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        dst: Joi.valid(dst.AUTO, dst.ONE, dst.ZERO),
        gmt: Joi.number(),
        period: Joi.string().valid(period.YEAR, period.MONTH).required(),
        method: Joi.string().valid(
            method.MWL,
            method.ISNA,
            method.EGYPT,
            method.MAKKAH,
            method.KARACHI,
            method.TEHRAN,
            method.JAFARI
        ),
        format: Joi.string().valid(timeFormat.H, timeFormat.HH),
        year: Joi.number().min(1900).max(2100)
    })
};

module.exports = {
    locationSchema
};
