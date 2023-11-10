"use strict";

/*
###Задание 2
Вы управляете рестораном, в котором работают разные повара, специализирующиеся 
на определенных блюдах. Клиенты приходят и делают заказы на разные блюда.
Необходимо реализовать функцию newOrder. Создавать вспомогательные функции, 
коллекции, не запрещается. Старайтесь использовать коллекции Map/Set, где это 
актуально. Представленный ниже код должен работать.

Повара и их специализации:
Олег - специализация: Пицца.
Андрей - специализация: Суши.
Анна - специализация: Десерты.

Блюда, которые могут заказать посетители:
Пицца "Маргарита"
Пицца "Пепперони"
Пицца "Три сыра"
Суши "Филадельфия"
Суши "Калифорния"
Суши "Чизмаки"
Суши "Сеякемаки"
Десерт Тирамису
Десерт Чизкейк
*/

// Посетитель ресторана.
class Client {
  constructor(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
  }
}

// Вам необходимо реализовать класс, который управляет заказами и поварами.
class Manager {
  #order_genIDs
  

  /**
  * Конструктор для менеджера заказов
  * @constructor
  * @param {Map<string,string>} emploeyers_respons - карта сотрудников-обязанностей
  * @param {Array<string>} workers - список имен сотрудников
  * @param {Array<string>} dishes - список блюд
  */
  constructor(workers, emploeyers_respons, dishes) {
    this.#validators.constructor(workers, emploeyers_respons, dishes);

    const genIDs = function () {
      let id = 0;
      function increm() {
        return id++;
      }
      return increm;
    }


    class dishStruct {
      constructor(dishes) {
        this.list = new Map(dishes
          .map((obj) => {
            return ([`${obj.type} ${obj.name}`, obj]);
          }));
      };

      /**
 * @memberof! Manager#
 * @instance dishes.getDish
 * @param {string} type - тип блюда
 * @param {string} name - имя блюд
 * 
 * @returns {object} гет блюдо по ключу
 */
      getDish(type, name) {
        return this.list.get(`${type} ${name}`);
      };
      /**
* @memberof! Manager#
* @instance dishes.has
* @param {string} type - тип блюда
* @param {string} name - имя блюд
* 
* @returns {object} boolean наличия
*/
      has(type, name) {
        let el = this.getDish(type, name);
        return el != undefined;
      }
    };
    this.dishes = new dishStruct(dishes);

    this.emploeyers_respons = emploeyers_respons;

    const genIdWorkers = genIDs();
    this.workers = workers.map(x => { return { id: genIdWorkers(), name: x } })


    this.orders = [];
    this.#order_genIDs = genIDs();
  }



  /**
  * Метод создания заказа
  * @method
  * @param {Client} client - объект клиента
  * @param {{ name: string, quantity: number, type: string }} orderData - данные заказа
  */
  newOrder(client, ...orderData) {
    let partOrderSystem = [];
    orderData.forEach(x => {
      try {
        this.#validators.newOrder(this, client, x);
        partOrderSystem.push(null);
      } catch (e) {
        partOrderSystem.push(e.message.replace('Error: ', ''));
      }
    });

    const order={
      orderData: orderData,
      id: this.#order_genIDs(),
      workers: [...new Set(orderData.map(x => x.type))].map(x => this.emploeyers_respons.get(x))
    };
    this.orders.push(order)

    console.log(``);
    console.log(`Клиент ${client.firstname} заказал:`);
    orderData.forEach((x, i) => {
      if (partOrderSystem[i] != null) {
        console.log(partOrderSystem[i]);
        return;
      }
      console.log(`${x.type} "${x.name}" - ${x.quantity}; готовит повар ${this.workers[this.emploeyers_respons.get(x.type)].name}`);
    })
    if(!partOrderSystem.every(x=>x==null))console.log(`Заказ №${order.id} выполнен частично`);
  }

  #validators = {
    constructor: function (workers, emploeyers_respons, dishes) {
      try {
        if (!emploeyers_respons instanceof Map) throw new Error(`Неправильный тип данных для emploeyers_respons`);
        if (![...emploeyers_respons.entries()].every(x => typeof x[0] === 'string'
          & typeof x[1] === 'number')) throw new Error(`Неправильный тип данных для emploeyers_respons`);
        if (!workers.every(x => typeof x === 'string')) throw new Error(`Неправильный тип данных для workers`);
        if (!dishes.every(x => typeof x.type === 'string'
          & typeof x.name === 'string')) throw new Error(`Неправильный тип данных для dishes`);
      } catch (e) {
        throw new Error(`Неправильные данные для объекта Manager ${e}`)
      }
    },
    newOrder: function (cntxt, client, orderData) {
      let knownError = false;

      try {
        if (!(client instanceof Client)
          || !(orderData instanceof Object)) throw new
            Error(`Неправильный тип данных для newOrder()`);
        if (!(typeof (orderData.name) === 'string') || !(typeof (orderData.quantity) === 'number')
          || !(typeof (orderData.type) === 'string')) {
          knownError = true;
          throw newError(`Неправильный тип данных для orderData`);
        }
        if (!cntxt.emploeyers_respons.has(orderData.type)) {
          knownError = true;
          throw new Error(`Данный вид продукта ${orderData.type} не готовится`);
        }
        if (!cntxt.dishes.has(orderData.type, orderData.name)) {
          knownError = true;
          throw new Error(`${orderData.type} "${orderData.name}" - такого блюда не существует`);
        }
      } catch (e) {
        if (knownError) throw new Error(e);
        throw new Error(`Неправильные данные для объекта Manager ${e}`)
      }
    }
  }

}
// Можно передать внутрь конструктора что-либо, если необходимо.
const manager = new Manager(["Олег", "Андрей", "Анна"],
  new Map([['Пицца', 0], ['Суши', 1], ['Десерт', 2]]),
  [{ type: 'Пицца', name: 'Маргарита' },
  { type: 'Пицца', name: 'Пепперони' },
  { type: 'Пицца', name: 'Три сыра' },
  { type: 'Суши', name: 'Филадельфия' },
  { type: 'Суши', name: 'Калифорния' },
  { type: 'Суши', name: 'Чизмаки' },
  { type: 'Суши', name: 'Сеякемаки' },
  { type: 'Десерт', name: 'Тирамису' },
  { type: 'Десерт', name: 'Чизкейк' }]
);

// Вызовы ниже должны работать верно, менять их нельзя, удалять тоже.
manager.newOrder(
  new Client("Иван", "Иванов"),
  { name: "Маргарита", quantity: 1, type: "Пицца" },
  { name: "Пепперони", quantity: 2, type: "Пицца" },
  { name: "Чизкейк", quantity: 1, type: "Десерт" },
);
// Вывод:
// Клиент Иван заказал: 
// Пицца "Маргарита" - 1; готовит повар Олег
// Пицца "Пепперони" - 2; готовит повар Олег
// Десерт "Чизкейк" - 1; готовит повар Анна

// ---

const clientPavel = new Client("Павел", "Павлов");
manager.newOrder(
  clientPavel,
  { name: "Филадельфия", quantity: 5, type: "Суши" },
  { name: "Калифорния", quantity: 3, type: "Суши" },
);
// Вывод:
// Клиент Павел заказал: 
// Суши "Филадельфия" - 5; готовит повар Андрей
// Суши "Калифорния" - 3; готовит повар Андрей

manager.newOrder(
  clientPavel,
  { name: "Калифорния", quantity: 1, type: "Суши" },
  { name: "Тирамису", quantity: 2, type: "Десерт" },
);
// Вывод:
// Клиент Павел заказал: 
// Суши "Филадельфия" - 5; готовит повар Андрей
// Суши "Калифорния" - 4; готовит повар Андрей
// Десерт "Тирамису" - 2; готовит повар Анна

manager.newOrder(
  clientPavel,
  { name: "Филадельфия", quantity: 1, type: "Суши" },
  { name: "Трубочка с вареной сгущенкой", quantity: 1, type: "Десерт" },
);
// Ничего не должно быть добавлено, должна быть выброшена ошибка:
// Десерт "Трубочка с вареной сгущенкой" - такого блюда не существует.
