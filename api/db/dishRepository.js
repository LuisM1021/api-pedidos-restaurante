const pool = require('../db/db.js');

class DishRepository{
    async getAllDishes() {
        const dishes = await pool.query('SELECT * FROM dishes');
        return dishes;
    }
    async save(dish){
        const query = 'INSERT INTO dishes(name, price, category_id) VALUES($1, $2, $3)';
        const values = [dish.name, dish.price, dish.categoryId];

        await pool.query(query, values);
    }
}

module.exports = DishRepository;

