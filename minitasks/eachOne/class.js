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
