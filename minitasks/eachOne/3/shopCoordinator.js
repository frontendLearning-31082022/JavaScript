class ShopCoordinator {
    static KEY_LOCAL_STORE = 'reviews'
    static PRODUCTS_LIST_CLASS = 'products-list'

    static addReview(e) {
        e.preventDefault();
        e = e.target;

        const product = e.getElementsByClassName('add-order__name-product')[0].value;
        const review = e.getElementsByClassName('add-order__review-text')[0].value;

        id = id ? new Map(JSON.parse(id)).size : 0;

        this.localStorage.putToMap(ShopCoordinator.KEY_LOCAL_STORE, id, { product: product, review: review });

        e.getElementsByClassName('add-order__name-product')[0].value = '';
        e.getElementsByClassName('add-order__review-text')[0].value = '';
        new Popup().showAndHide('Успешно добавлен отзыв');
    }

    static localStorage = {
        putToMap: function (localStokeKey, id, val) {
            let stored = localStorage.getItem(localStokeKey);
            let map = new Map();
            if (stored) map = new Map(JSON.parse(stored));

            map.set(id, val);

            stored = JSON.stringify(Array.from(map.entries()));
            localStorage.setItem(ShopCoordinator.KEY_LOCAL_STORE, stored);
        }
    }


    constructor() {
        this.products = new Map();
        this.reviews = new Map();
        this.products_list_dom = document.getElementsByClassName('products-list')[0];
    }

    loadArticlesProducts() {
        const articles = localStorage.getItem(ShopCoordinator.KEY_LOCAL_STORE);
        if (articles) this.reviews = new Map(JSON.parse(articles));

        this.#initDom();

        debugger;

    }

    #initDom() {
        [...this.reviews.keys()].forEach(key => {
            const x = this.reviews.get(key);

            if (!this.products.has(x.product)) {
                const productContainer = document.createElement("div");
                productContainer.classList.add('product');
                productContainer.innerHTML = `<div class="product__name"> ${x.product} </div>
                <div class="product__reviews"></div>
                 `;
                this.products_list_dom.appendChild(productContainer);
                this.products.set(x.product, {
                    name: x.product, dom: productContainer, reviews: [],
                    addReview: function (review) {
                        this.reviews.push(review);
                        this.dom.getElementsByClassName('product__reviews')[0].appendChild(review.dom);
                    }
                });
            }

            const review = document.createElement("div");
            review.classList.add('review');
            review.textContent = x.review;
            x['dom'] = review;

            x['product'] = this.products.get(x.product);
            x['product'].addReview(x);

            debugger;
            this.reviews.set(key, x);



            // debugger;

        });

    }
}



/*
let shopCoordinator = {
    KEY_LOCAL_STORE: 'reviews',

    addReview: function (e) {
        e.preventDefault();
        e = e.target;

        const product = e.getElementsByClassName('add-order__name-product')[0].value;
        const review = e.getElementsByClassName('add-order__review-text')[0].value;

        let id = localStorage.getItem(this.KEY_LOCAL_STORE);
        id = id ? new Map(JSON.parse(id)).size : 0;

        this.localStorage.putToMap(this.KEY_LOCAL_STORE, id, { product: product, review: review });

        e.getElementsByClassName('add-order__name-product')[0].value = '';
        e.getElementsByClassName('add-order__review-text')[0].value = '';
        new Popup().showAndHide('Успешно добавлен отзыв');
    },
    localStorage: {
        putToMap: function (localStokeKey, id, val) {
            let stored = localStorage.getItem(localStokeKey);
            let map = new Map();
            if (stored) map = new Map(JSON.parse(stored));

            map.set(id, val);

            stored = JSON.stringify(Array.from(map.entries()));
            localStorage.setItem(shopCoordinator.KEY_LOCAL_STORE, stored);
        }
    },
    Dom: {
        loadArticles: function () {
            const data = localStorage.getItem(localStokeKey);
            alert('ad');
        }
    }
}
*/