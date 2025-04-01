const express = require('express');
const DishService = require('../services/dishService');

const router = express.Router();

const service = new DishService();

router.get('/', async(req, res) => {

    const dishes = await service.find();
    res.status(200).json(dishes);
});

module.exports = router;