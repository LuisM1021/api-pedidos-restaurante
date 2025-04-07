const express = require('express');

const dishesRouter = require('./dishesRouter');
const ordersRouter = require('./ordersRouter');

function routerApi(app){
    const router = express.Router();
    app.use('/api', router);

    router.use('/dishes', dishesRouter);
    router.use('/orders', ordersRouter);
}

module.exports = routerApi;