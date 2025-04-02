const boom = require('@hapi/boom');

class DishService{

    dishRepository;

    constructor(dishRepository){
        this.dishRepository = dishRepository;

    }

    async find(){

        const dishes = await this.dishRepository.getAllDishes();
        return dishes;

    }

    async findOne(id){
        const dish = await this.dishRepository.getDishById(id);
        return dish;
    }

    async create(data){
        if(data == null){
            throw boom.badRequest('Data is required');
        }
        return await this.dishRepository.save(data);
    }

    async update(id, changes){
        if(changes == null){
            throw boom.badRequest('Data is required');
        }
        const updatedDish = await this.dishRepository.update(id, changes);
        return updatedDish;
    }

}

module.exports = DishService;