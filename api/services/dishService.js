const boom = require('@hapi/boom');
const path = require('path');
const fs = require('fs');

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

    async uploadImage(id, file){
        if(!file){
            throw boom.badRequest('No se pudo subir la imagen');
        }
        try{
            const dish = await this.findOne(id);
            const imageUrl = `/uploads/${file.filename}`;

            await this.dishRepository.update(dish.id, { imageUrl });
            return imageUrl;
        }catch(error){
            fs.unlinkSync(path.join(__dirname, '../../uploads', file.filename));
            throw boom.notFound('Dish not found');
        }

    }
}

module.exports = DishService;