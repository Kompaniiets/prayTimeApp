const express = require('express');
const cors = require('cors');

const config = require('./config');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const app = express();

const NOT_FOUND = 404;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req, res, next) => {
    next(new ApiError(NOT_FOUND, 'Endpoint not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);
// handle error
app.use(errorHandler);

app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
});
