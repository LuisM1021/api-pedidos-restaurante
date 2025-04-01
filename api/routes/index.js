const express = require('express');

const dishesRouter = require('./dishesRouter');

function routerApi(app){
    const router = express.Router();
    app.use('/api', router);

    router.use('/dishes', dishesRouter);
}

module.exports = routerApi;