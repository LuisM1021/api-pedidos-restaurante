const Dish = require("../domain/dish");

class DishService{

    dishRepository;

    constructor(dishRepository){
        this.dishRepository = dishRepository;

    }

    async find(){

        const dishes = await this.dishRepository.getAllDishes();
        return dishes.rows;

    }

    async create({name, price, categoryId}){
        const dish = Dish.create(name, price, categoryId);
        return await this.dishRepository.save(dish);
    }

}

module.exports = DishService;