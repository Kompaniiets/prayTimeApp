const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: 3000,
    TIME_API_URL: 'https://timeapi.io/api/TimeZone/coordinate'
};
