class Dish{
    
    constructor(id = null, name, price, categoryId, isActive = null){
        this.id = id;
        this.name = name;
        this.price = price;
        this.categoryId = categoryId;
        this.isActive = isActive;
    }

    static create(name, price, categoryId){
        return new Dish(null, name, price, categoryId, null);
    }
}

module.exports = Dish;