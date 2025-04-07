const express = require('express');
const OrderService = require('../services/orderService');
const OrderRepository = require('../db/orderRepository');
const { createOrderSchema, getOrderSchema, updateOrderSchema, addDishToOrderSchema, getDishOrderSchema, updateDishFromOrderSchema } = require('../schemas/orderSchema');
const validationHandler = require('../middlewares/validationHandler');

const router = express.Router();
const service = new OrderService(new OrderRepository());

router.get('/', async (req, res, next) => {
    try{
        const orders = await service.findAll();
        res.status(200).json(orders);
    }catch(error){
        next(error);
    }
});

router.get('/:id',
    validationHandler(getOrderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const order = await service.findOne(id);
            res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/',
    validationHandler(createOrderSchema, 'body'),
    async (req, res, next) => {
        try {
            const body = req.body;
            const newOrder = await service.create(body);
            res.status(201).json(newOrder);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:id',
    validationHandler(getOrderSchema, 'params'),
    validationHandler(updateOrderSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const body = req.body;
            const updatedOrder = await service.update(id, body);
            res.status(200).json(updatedOrder);
        } catch (error) {
            next(error);
        }
    }
)

router.post('/:id/dishes',
    validationHandler(getOrderSchema, 'params'),
    validationHandler(addDishToOrderSchema, 'body'),
    async (req, res, next) => {
        try {
            const { id: orderId } = req.params;
            const { dishId } = req.body;
            const addedOrderDish = await service.addDishToOrder(orderId, dishId);
            res.status(201).json(addedOrderDish);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:orderId/dishes/:dishId',
    validationHandler(getDishOrderSchema, 'params'),
    async (req, res, next) => {
        try {
            const { orderId, dishId } = req.params;
            const result = await service.removeDishFromOrder(orderId, dishId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/:orderId/dishes/:dishId',
    validationHandler(getDishOrderSchema, 'params'),
    validationHandler(updateDishFromOrderSchema, 'body'),
    async (req, res, next) => {
        try {
            const { orderId, dishId } = req.params;
            const body = req.body;
            const updatedOrderDish = await service.updateOrderDish(orderId, dishId, body);
            res.status(200).json(updatedOrderDish);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;