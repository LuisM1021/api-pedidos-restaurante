const Joi = require('joi');

const id = Joi.number().integer().positive();
const tableNumber = Joi.number().integer().min(1).max(20);
const state = Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED');

const dishId = Joi.number().integer().positive();
const quantity = Joi.number().integer().positive().max(50);

const createOrderSchema = Joi.object({
    tableNumber: tableNumber.required()
});

const updateOrderSchema = Joi.object({
    tableNumber,
    state
});

const getOrderSchema = Joi.object({
    id: id.required()
});

const addDishToOrderSchema = Joi.object({
    dishId: dishId.required()
});

const updateDishFromOrderSchema = Joi.object({
    quantity: quantity.required()
});

const getDishOrderSchema = Joi.object({
    orderId: id.required(),
    dishId: dishId.required()
})

module.exports = { 
    createOrderSchema,
    updateOrderSchema,
    getOrderSchema,
    addDishToOrderSchema,
    getDishOrderSchema,
    updateDishFromOrderSchema
}