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