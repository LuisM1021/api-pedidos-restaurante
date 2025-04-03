const Joi = require('joi');

const id = Joi.number().integer().positive();
const name = Joi.string().min(3).max(50);
const categoryId = Joi.number().integer().positive();
const price = Joi.number().positive();
const isActive = Joi.boolean();
const description = Joi.string().min(3).max(200);

const createDishSchema = Joi.object({
  name: name.required(),
  description: description.required(),
  price: price.required(),
  categoryId: categoryId.required()
});

const updateDishSchema = Joi.object({
    name: name,
    description: description,
    price: price,
    categoryId: categoryId,
    isActive: isActive
});

const getDishSchema = Joi.object({
    id: id.required()
});

module.exports = {
    createDishSchema,
    updateDishSchema,
    getDishSchema
}