const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');

const config = require('./config');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const app = express();

/**
 * !!! IMPORTANT - do not remove the line below
 * Setup timezone for remote servers witch currently set to UTC
 */
process.env.TZ = 'Europe/London';

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Endpoint not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
});
