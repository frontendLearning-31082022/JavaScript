"use strict";

/*
###Задание 1
Необходимо создать класс Library. Конструктор класса, должен принимать начальный 
список книг (массив) в качестве аргумента. Убедитесь, что предоставленный массив 
не содержит дубликатов; в противном случае необходимо выбросить ошибку.
1. Класс должен содержать приватное свойство #books, которое должно хранить 
книги, переданные при создании объекта.
2. Реализуйте геттер-функцию allBooks, которая возвращает текущий список книг.
3. Реализуйте метод addBook(title), который позволяет добавлять книгу в список. 
Если книга с таким названием уже существует в списке, выбросьте ошибку с 
соответствующим сообщением.
4. Реализуйте метод removeBook(title), который позволит удалять книгу из списка 
по названию. Если книги с таким названием нет в списке, выбросьте ошибку с 
соответствующим сообщением.
5. Реализуйте метод hasBook(title), который будет проверять наличие книги в 
библиотеке и возвращать true или false в зависимости от того, есть ли такая 
книга в списке или нет.
*/

class Book {
    constructor(name, author) {
        this.name = name;
        this.author = author;
    };
    getUniqKey() {
        return this.toString();
    }
    toString() {
        return `${this.name} ${this.author}`;
    }
}


class Library {
    #books
    constructor(bookArray) {
        this.#validators.constructor(bookArray);

        this.#books = new Map(bookArray.map(x => ([x.getUniqKey(), x])));
    }

    /**
 * @description get string list all books
 */
    get allBooks() {
        return [...this.#books.values()].map(x => x.toString());
    }

    addBook(book) {
        this.#validators.addBook(book, this);

    }

    hasBook(name, author) {
        const key = new Book(name, author).getUniqKey();
        return this.#books.has(key);
    }

    removeBook(book) {
        this.#validators.removeBook(book, this);

        this.#books.delete(book.getUniqKey());
    }
    #validators = {
        constructor: function (bookArray) {
            if (!bookArray.every(x => x instanceof Book)) throw new
                Error('Массив книг состоит не из объектов класса Book');
            if (new Set(bookArray.map(x => x.getUniqKey())).size != bookArray.length) throw new
                Error(`В списке присутствуют дубликаты дубликат`);

        },
        addBook: function (book, cntxt) {
            if (!(book instanceof Book)) throw new Error('Метод addBook принимает только объ]еты Book');
            if (cntxt.#books.has(book.getUniqKey())) throw new
                Error(`Данная книга ${book} уже присутствует в списке`);
        },
        removeBook: function (book, cntxt) {
            if (!(book instanceof Book)) throw new Error('Метод removeBook принимает только объ]еты Book');
            if (!cntxt.#books.has(book.getUniqKey())) throw new
                Error(`Данная книга "${book}" остутствует в списке`);
        }
    }
}






class TestCase {
    static run() {
        Object.getOwnPropertyNames(TestCase).filter(prop => typeof TestCase[prop] === "function").forEach(x => {
            if (x.indexOf('test_') != 0) return;
            try {
                TestCase.setUp();
                TestCase[x]();
                console.log(`== test ${x} success`);
            } catch (e) {
                console.log(`======== test ${x} failed`);
            }

        })
    }

    static setUp() {
        TestCase.books = [new Book('Гордость и предубеждение', 'Джейн Остен'),
        new Book('451° по Фаренгейту', 'Рэй Брэдбери'),
        new Book('Над пропастью во ржи', 'Джером Д. Сэлинджер'),
        new Book('О дивный новый мир', 'Олдос Хаксли'),
        new Book('Преступление и наказание', 'Федор Достоевский'),
        new Book('Финансист', 'Теодор Драйзер'),
        ];
    }

    static test_constructorDuplicates() {
        const books = [new Book('Гордость и предубеждение', 'Джейн Остен'),
        new Book('Гордость и предубеждение', 'Джейн Остен')];

        try {
            new Library(books)
        } catch (e) {
            console.assert(e.message == 'В списке присутствуют дубликаты дубликат');
        }
    }

    static test_allBooks_getter() {
        const all = new Library(TestCase.books).allBooks;
        console.assert(all.toString() == "Гордость и предубеждение Джейн Остен,451° по Фаренгейту Рэй Брэдбери,Над пропастью во ржи Джером Д. Сэлинджер,О дивный новый мир Олдос Хаксли,Преступление и наказание Федор Достоевский,Финансист Теодор Драйзер");
    }

    static test_addBook() {
        const lib = new Library(TestCase.books);
        lib.addBook(new Book('новая', 'новвая'));
    }
    static test_addBook_distinct() {
        const lib = new Library(TestCase.books);
        try {
            lib.addBook(new Book('451° по Фаренгейту', 'Рэй Брэдбери'));
        } catch (e) {
            console.assert(e.message == 'Данная книга 451° по Фаренгейту Рэй Брэдбери уже присутствует в списке');
        }
    }

    static test_deleteBook() {
        const lib = new Library([new Book('Гордость и предубеждение', 'Джейн Остен')]);
        lib.removeBook(new Book('Гордость и предубеждение', 'Джейн Остен'));

        console.assert(!lib.hasBook('Гордость и предубеждение', 'Джейн Остен'));
    }

    static test_deleteBook_noExist() {
        const lib = new Library([new Book('Гордость и предубеждение', 'Джейн Остен')]);

        try {
            lib.removeBook(new Book('нет', 'нет'));
        } catch (e) {
            console.assert(e.message == "Данная книга \"нет нет\" остутствует в списке");
        }
    }

    static test_hasBook() {
        const lib = new Library([new Book('Гордость и предубеждение', 'Джейн Остен')]);
        console.assert(lib.hasBook('Гордость и предубеждение','Джейн Остен'));
        console.assert(!lib.hasBook('нет','Джейн Остен'));

    }

}
TestCase.run();