"use strict";

/*
###Задание 1
Создайте обычный объект "Музыкальная коллекция", который можно итерировать. 
Каждая итерация должна возвращать следующий альбом из коллекции. Коллекция 
альбомов - это массив внутри нашего объекта (создать несколько альбомов самому).
Каждый альбом имеет следующую структуру:
{
  title: "Название альбома",
  artist: "Исполнитель",
  year: "Год выпуска"
}
Используйте цикл for...of для перебора альбомов в музыкальной коллекции и 
вывода их в консоль в формате:
"Название альбома - Исполнитель (Год выпуска)"
*/

class MusicCollection {
  #albums;
  constructor(albums) {
    this.#albums = albums;
    this.initIterator(this.#albums);
  }

  initIterator(objects) {
    this[Symbol.iterator] = () => {
      return {
        current: 0,
        last: this.#albums.length - 1,

        next() {
          return this.current <= this.last ?
            { done: false, value: objects[this.current++] }
            : { done: true };

        }
      }
    };
  }

}

const albums = [
  {
    title: "The Works",
    artist: "Chris Rea",
    year: "2007"
  },
  {
    title: "New Light Through Old Windows",
    artist: "Chris Rea",
    year: "1988"
  },
  {
    title: "Dancing with Strangers",
    artist: "Chris Rea",
    year: "2019"
  }
];

const objj = new MusicCollection(albums);

for (const item of objj) {
  console.log(item);
}