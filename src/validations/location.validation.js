const Joi = require('joi');

const locationSchema = {
    query: Joi.object().keys({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        dst: Joi.string().required(),
        gmt: Joi.number().required()
    })
};

module.exports = {
    locationSchema
};
