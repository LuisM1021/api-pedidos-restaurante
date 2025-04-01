const express = require('express');
const DishService = require('../services/dishService');

const router = express.Router();

const DishRepository = require('../db/dishRepository');
const service = new DishService(new DishRepository());

router.get('/', async(req, res) => {

    const dishes = await service.find();
    res.status(200).json(dishes);
});

router.post('/', async(req, res) => {
    const body = req.body;
    service.create(body);
    res.status(201).json({
        message: 'created'
    });
});

module.exports = router;