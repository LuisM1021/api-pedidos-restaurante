const boom = require('@hapi/boom');

class OrderService{

    constructor(orderRepository){
        this.orderRepository = orderRepository;
    }

    async findAll(){
        const orders = await this.orderRepository.getAllOrders();
        return orders;
    }

    async findOne(id){
        const order = await this.orderRepository.getOrderById(id);
        if(!order){
            throw boom.notFound('Order not found');
        }
        return order;
    }

    async create(order){
        const createdOrder = await this.orderRepository.save(order);
        return createdOrder;
    }

    async update(id, changes){
        if(!changes){
            throw boom.badRequest('No changes provided');
        }
        const updatedOrder = await this.orderRepository.update(id, changes);
        return updatedOrder;
    }

    async addDishToOrder(orderId, dishId){
        const addedDish = await this.orderRepository.addDishToOrder(orderId, dishId);
        return addedDish;
    }

    async removeDishFromOrder(orderId, dishId){
        const result = await this.orderRepository.removeDishFromOrder(orderId, dishId);
        return {
            success: result
        };
    }

    async updateOrderDish(orderId, dishId, changes){
        const updatedOrderDish = await this.orderRepository.updateDishFromOrder(orderId, dishId, changes.quantity);
        return updatedOrderDish;
    }

}

module.exports = OrderService;