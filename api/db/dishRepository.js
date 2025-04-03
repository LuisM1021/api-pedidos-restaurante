const pool = require('../db/db.js');
const boom = require('@hapi/boom');

class DishRepository{

    async getAllDishes() {
        try{
            const query = `
            SELECT d.id, d.name, d.description, d.price, d.is_active, d.image_url,
            json_build_object(
                'id', c.id,
                'name', c.name,
                'description', c.description
            ) as category
            FROM dishes d
            JOIN categories c on d.category_id = c.id 
            `;
            const dishes = await pool.query(query);
            return dishes.rows;
        }catch(error){
            throw boom.internal(`Error fetching dishes: ${error.message}`);
        }
    }

    async getDishById(id) {
        const query = 'SELECT * FROM dishes WHERE id = $1';
        const values = [id];
        try{
            const dish = await pool.query(query, values);
            if(dish.rows.length === 0){
                throw boom.notFound('Dish not found');
            }
            return dish.rows[0];
        }catch(error){
            throw boom.internal(`Error fetching dish: ${error.message}`);
        }
    }

    async save(dish){
        const query = 'INSERT INTO dishes(name, description, price, category_id) VALUES($1, $2, $3) RETURNING *';
        const values = [dish.name, dish.description, dish.price, dish.categoryId];
        try{
            const createdDish = await pool.query(query, values);
            return createdDish.rows[0];
        }catch(error){
            if (error.code === '23503') { // Código de error de clave foránea en PostgreSQL
                throw boom.badRequest('Category ID does not exist');
            }else if (error.code === '23505') { // Código de error de duplicado en PostgreSQL{
                throw boom.conflict('Dish already exists');
            }
            throw boom.internal(`Error creating dish: ${error}`);
        }
    }

    async update(id, changes) {
        
        const fields = [];
        const values = [];
        let index = 1;
        
        if(changes.name){
            fields.push(`name = $${index++}`);
            values.push(changes.name);
        }
        if(changes.description){
            fields.push(`description = $${index++}`);
            values.push(changes.description);
        }
        if(changes.price){
            fields.push(`price = $${index++}`);
            values.push(changes.price);
        }
        if(changes.categoryId){
            fields.push(`category_id = $${index++}`);
            values.push(changes.categoryId);
        }
        if(changes.isActive !== undefined){
            fields.push(`is_active = $${index++}`);
            values.push(changes.isActive);
        }
        if(changes.imageUrl){
            fields.push(`image_url = $${index++}`);
            values.push(changes.imageUrl);
        }
        
        if(fields.length === 0){
            throw boom.badRequest('No changes provided');
        }

        const query = `UPDATE dishes SET ${fields.join(',')} WHERE id = $${index} RETURNING *`;
        values.push(id);
        try{
            const updatedDish = await pool.query(query, values);
            if(updatedDish.rows.length === 0){
                throw boom.notFound('Dish not found');
            }
            return updatedDish.rows[0];
        }catch(error){
            if (error.code === '23503') { // Código de error de clave foránea en PostgreSQL
                throw boom.badRequest('Category ID does not exist');
            }
            throw boom.internal(`Error updating dish: ${error.message}`);
        }
    }
}

module.exports = DishRepository;

