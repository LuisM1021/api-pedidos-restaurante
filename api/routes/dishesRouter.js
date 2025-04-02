const express = require('express');
const DishService = require('../services/dishService');
const validationHandler = require('../middlewares/validationHandler');
const { createDishSchema, getDishSchema, updateDishSchema } = require('../schemas/dishSchema');

const router = express.Router();

const DishRepository = require('../db/dishRepository');
const service = new DishService(new DishRepository());

router.get('/', async(req, res, next) => {
    try{
        const dishes = await service.find();
        res.status(200).json(dishes);
    }catch(error){
        next(error);
    }
});

router.post('/',
    validationHandler(createDishSchema, 'body'),
    async(req, res, next) => {
        try{
            const body = req.body;
            const newDish = await service.create(body);
            res.status(201).json(newDish);
        }catch(error){
            next(error);
        }
    }
);

router.patch('/:id',
    validationHandler(getDishSchema, 'params'),
    validationHandler(updateDishSchema, 'body'),
    async(req, res, next) => {
        try{
            const { id } = req.params;
            const body = req.body;
            const updatedDish = await service.update(id, body);
            res.status(200).json(updatedDish);
        }catch(error){
            next(error);
        }
    }
);

module.exports = router;