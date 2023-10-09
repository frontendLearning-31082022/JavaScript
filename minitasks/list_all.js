// recur_DOM.js
// Напишите рекурсивную функцию findElementByClass, которая принимает корневой
// элемент дерева DOM и название класса в качестве аргументов и возвращает первый
// найденный элемент с указанным классом в этом дереве.
function findElementByClass(element, className) {
    if (element.classList.contains(className)) return element;

    for (let child of element.children) {
        const finded = findElementByClass(child, className);
        if (finded) return finded;
    }
}
const recur = findElementByClass(document.body, 'name');

//________________________________________________________

// class.js
// Реализуйте класс Book
class Book {
    #name;
    #author;
    #pages;
    constructor(name, author, pages) {
        this.#name = name;
        this.#author = author;
        this.#pages = pages;
    }

    displayInfo() {
        console.log(`Title: ${this.#name}, Author: ${this.#author}, Pages: ${this.#pages}`);
    }
}

const book = new Book("BookName1", "Author1", 123);
book.displayInfo();

// Реализуйте класс Student
class Student {
    constructor(name, age, grade) {
        this.name = name;
        this.age = age;
        this.grade = grade;
    }

    displayInfo() {
        console.log(`Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`);
    }
}

const student = new Student("John Smith", 16, "10th grade");
student.displayInfo();


//________________________________________________________

// class_func.js
// Напишите функцию createCounter, которая создает счетчик и возвращает объект
// с двумя методами: increment и decrement. Метод increment должен увеличивать
// значение счетчика на 1, а метод decrement должен уменьшать значение счетчика
// на 1. Значение счетчика должно быть доступно только через методы объекта,
// а не напрямую.
function createCounter() {
    let val = 0;

    return {
        increment: function () {
            val++;
        },
        decrement: function () {
            val--;
        },
        getVal: function () {
            return val;
        }
    };
}

//________________________________________________________

// class_extend.js
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

//________________________________________________________

// fetch_get.js
// Реализуйте запрос пользователя с reqres.in
if (typeof fetch === 'undefined')fetch=function(){
    // npm install node-fetch   // npm install node-fetch@2
    try { return require("node-fetch"); }
    catch { }
}();

async function getUserData(ID) {
    const url = 'https://reqres.in/api/users/' + ID;
    const responce = await fetch(url);

    let resLoad = null;
    if (!responce.ok) resLoad = await responce.text().then(allText => { return `Error - can't get user. Status ${responce.status} - ${allText}`; });
    if (responce.ok) resLoad = await responce.json();

    return responce.ok ? Promise.resolve(resLoad.data) : Promise.reject(resLoad);
}

const usrExist = getUserData('2');
usrExist.then(user => { console.log(user); })
    .catch(err => { console.log(err); })

const usrNo = getUserData('23');
usrNo.then(user => { console.log(user); })
    .catch(err => { console.log(err); })

//________________________________________________________

// fetch_post.js
// Реализуйте сохранение пользователя на ресурсе reqres.in
if (typeof fetch === 'undefined') fetch = function () {
    // npm install node-fetch // npm install node-fetch@2
    try { return require("node-fetch"); }
    catch { }
}();

async function saveUserData(usrObj) {
    try {
        const response = await fetch("https://reqres.in/api/users", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usrObj),
        });

        const result = await response.json();
        return Promise.resolve(result);
    } catch (error) {
        throw new Error(error);
    }
}

const data = [
    {
        "name": "John Doe",
        "job": "unknown"
    },
    1];

data.forEach((user) => {
    saveUserData(user).then((echo) => {
        console.log('User data saved successfull\n' + JSON.stringify(echo));
    }).catch(error => {
        console.log(error.message);
    });
});

//________________________________________________________
