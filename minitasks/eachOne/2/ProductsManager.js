class ProductsManager {
    constructor(data) {
        this.data = data;

    }

    addReview(btn) {
        debugger;
        let prod = btn;
        while (prod.className != 'product') prod = prod.parentNode;
        const vrd_id = prod.getElementsByClassName('reviews')[0].getAttribute('vrd_id');

        const text = prod.querySelectorAll('input')[0].value;

        prod.getElementsByClassName('addReview')[0].classList.remove('invalid');
        if (text.length < 50 | text.length > 500) {
            prod.getElementsByClassName('addReview')[0].classList.add('invalid');
            return;
        }

        const reactVar = domReact.getVar(vrd_id);

        let id = prod.getElementsByClassName('reviews')[0].children.length;
        debugger;

        const fields = new Map();
        fields.set("text", text).set("id", id);

        domReact.addVar(fields, reactVar);

        prod.querySelectorAll('input')[0].value = '';
        debugger;
    }

}