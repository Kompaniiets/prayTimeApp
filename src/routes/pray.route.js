const express = require('express');
const { prayController } = require('../controllers');
const validate = require('../middlewares/validate');
const locationValidation = require('../validations/location.validation');

const router = express.Router();

router
    .route('/getPrayerTimes')
    .get(validate(locationValidation.locationSchema), prayController.getPrayTime);

module.exports = router;
