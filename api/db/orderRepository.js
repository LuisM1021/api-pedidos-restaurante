const pool = require('../db/db');
const boom = require('@hapi/boom');

class OrderRepository{

    async getAllOrders(){
        const query = `
        SELECT o.id, o.table_number as "tableNumber", o.state, o.created_at as "createdAt",
        (
            SELECT json_agg(
                json_build_object(
                    'dishId', d.id,
                    'name', d.name, 
                    'price', d.price,
                    'categoryId', d.category_id,
                    'isActive', d.is_active,
                    'imageUrl', d.image_url,
                    'quantity', od.quantity
                )
            ) AS dishes
            FROM dishes d
            JOIN order_dish od ON od.dish_id = d.id AND od.order_id = o.id
        )
        FROM orders o
        `;
        try{
            const orders = await pool.query(query);
            return orders.rows;
        }catch(error){
            throw boom.internal(`Error getting orders: ${error}`);
        }
    }

    async getOrderById(id){
        try{
            const query = `
            SELECT o.id, o.table_number as "tableNumber", o.state, o.created_at as "createdAt",
            (
                SELECT json_agg(
                    json_build_object(
                        'dishId', d.id,
                        'name', d.name, 
                        'price', d.price,
                        'categoryId', d.category_id,
                        'isActive', d.is_active,
                        'imageUrl', d.image_url,
                        'quantity', od.quantity
                    )
                ) AS dishes
                FROM dishes d
                JOIN order_dish od ON od.dish_id = d.id AND od.order_id = o.id
            )
            FROM orders o
            WHERE o.id = $1
            `;
            const values = [id];
            const order = await pool.query(query, values);
            return order.rows[0];
        }catch(error){
            throw boom.internal(`Error getting orders: ${error}`);
        }
    }

    async save(order){
        //TODO: FIX DB removing hour field and setting a default state
        const defaultState = 'PENDING';
        const fakeHour = new Date();
        try{
            const query = `
            INSERT INTO orders(table_number, hour, state) VALUES($1, $2, $3) RETURNING id, table_number as "tableNumber", state, created_at as "createdAt"
            `;
            const values = [order.tableNumber, fakeHour, defaultState];
            const createdOrder = await pool.query(query, values);
            return createdOrder.rows[0];
        }catch(error){
            console.log('Error creaating order:', error)
            throw boom.internal(`Error creating order: ${error}`);
        }
    }

    async update(id, changes){
        const fields = [];
        const values = [];
        let index = 1;
        
        if(changes.tableNumber){
            fields.push(`table_number = $${index++}`);
            values.push(changes.tableNumber);
        }
        if(changes.state){
            fields.push(`state = $${index++}`);
            values.push(changes.state);
        }
        
        if(fields.length === 0){
            throw boom.badRequest('No changes provided');
        }

        const query = `
        UPDATE orders
        SET ${fields.join(',')}
        WHERE id = $${index}
        RETURNING id, table_number as "tableNumber", state, created_at as "createdAt"
        `;
        values.push(id);
        try{
            const updatedOrder = await pool.query(query, values);
            if(updatedOrder.rows.length === 0){
                throw boom.notFound('Order not found');
            }
            return updatedOrder.rows[0];
        }catch(error){
            if (error.output.statusCode === 404) { 
                throw error;
            }
            throw boom.internal(`Error updating order: ${error.message}`);
        }
    }

    async addDishToOrder(orderId, dishId){
        const initialQuantity = 1;
        const query = `
        WITH inserted AS (
            INSERT INTO order_dish(order_id, dish_id, quantity)
            VALUES($1, $2, $3)
            RETURNING *
        )
        SELECT 
            d.id, 
            d.name, 
            d.price, 
            d.category_id as "categoryId",
            d.is_active as "isActive", 
            d.image_url as "imageUrl", 
            i.quantity
        FROM dishes d
        JOIN inserted i ON i.dish_id = d.id
        `
        const values = [orderId, dishId, initialQuantity];
        try{
            const createdOrderDish = await pool.query(query, values);
            return createdOrderDish.rows[0];
        }catch(error){
            if (error.code === '23503') { // Código de error de clave foránea en PostgreSQL
                throw boom.badRequest('Order ID or Dish ID does not exist');
            }
            throw boom.internal(`Error adding dish to order: ${error}`);
        }
    }

    async removeDishFromOrder(orderId, dishId){
        const query = `
        DELETE FROM order_dish
        WHERE order_id = $1 AND dish_id = $2
        `
        const values = [orderId, dishId];
        try{
            const result = await pool.query(query, values);
            return result.rowCount === 1 ? true: false;
        }catch(error){
            if (error.code === '23503') { // Código de error de clave foránea en PostgreSQL
                throw boom.badRequest('Order ID or Dish ID does not exist');
            }
            throw boom.internal(`Error adding dish to order: ${error}`);
        }
    }

    async updateDishFromOrder(orderId, dishId, quantity){
        const query = `
        WITH updated AS(
            UPDATE order_dish
            SET quantity = $3
            WHERE order_id = $1 AND dish_id = $2
            RETURNING *
        )
        SELECT 
            d.id, 
            d.name, 
            d.price, 
            d.category_id as "categoryId",
            d.is_active as "isActive", 
            d.image_url as "imageUrl", 
            u.quantity
        FROM dishes d
        JOIN updated u ON u.dish_id = d.id
        `
        const values = [orderId, dishId, quantity];
        try{
            const updatedOrderDish = await pool.query(query, values);
            return updatedOrderDish.rows[0];
        }catch(error){
            if (error.code === '23503') { // Código de error de clave foránea en PostgreSQL
                throw boom.badRequest('Order ID or Dish ID does not exist');
            }
            throw boom.internal(`Error adding dish to order: ${error}`);
        }
    } 

}

module.exports = OrderRepository;