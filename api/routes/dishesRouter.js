const express = require('express');
const path = require('path');
const uploadImage = require('../utils/multer');
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

router.get('/:id',
    validationHandler(getDishSchema),
    async(req, res, next) => {
    try{
        const { id } = req.params;
        const dish = await service.findOne(id);
        res.status(200).json(dish);
    }catch(error){
        next(error);
    }
})

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

router.post('/img/:id',
    validationHandler(getDishSchema, 'params'),
    uploadImage.single('image'),
    async(req, res, next) => {
        try{
            const { id } = req.params;
            const file = req.file;

            const imageUrl = await service.uploadImage(id, file);
            res.status(201).json({ message: 'Image saved', url: imageUrl })

        }catch(error){
            next(error);
        }
    }
);

router.use('/img', express.static(path.join(__dirname, '../../uploads')));

module.exports = router;