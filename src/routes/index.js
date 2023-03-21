const express = require('express');
const prayRoute = require('./pray.route');

const router = express.Router();

const routes = [
    {
        path: '/',
        route: prayRoute,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
