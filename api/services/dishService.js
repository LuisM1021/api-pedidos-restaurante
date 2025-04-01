const pool = require('../db/db.js');

class DishService{

    async find(){

        const dishes = await pool.query('SELECT id, name FROM dishes');
        return dishes.rows;

    }

}

module.exports = DishService;