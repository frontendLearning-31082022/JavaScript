// Реализуйте класс с наследованием
class Employee {
    constructor(name) {
        this.name = name;
    }

    displayInfo() {
        console.log(`Name: ${this.name}`);
    }
}
class Manager extends Employee {
    constructor(name, department) {
        super(name);
        this.department = department;
    }
    displayInfo() {
        console.log(`Name: ${this.name}, Department: ${this.department}`);
    }
    displayName() {
        super.displayInfo();
    }
}

// Реализуйте класс с наследованием (защищенные поля)
class Product { //protected, for extends on feature
    constructor(name, price, quantity) {
        this._name = name;
        this._price = price;
        this._quantity = quantity;
    }
    get name() {
        return this._name;
    }
    set name(Unsupported) {
        throw new SyntaxError("Unsupported operation");
    }

    get price() {
        return this._price;
    }
    set price(price) {
        this._price = price;
    }

    get quantity() {
        return this._quantity;
    }
    set quantity(quantity) {
        this._quantity = quantity;
    }
}

class Order {
    #id;
    #products = [];
    constructor(id) {
        this.#id = id;
    }
    get id() {
        return this.#id;
    }
    set id(Unsupported) {
        throw new SyntaxError("Unsupported operation");
    }
    addProduct(product) {
        this.#products.push(product);
    }
    getTotalPrice() {
        return this.#products.reduce((sum, cur) => sum + (cur.price * cur.quantity), 0);
    }
}