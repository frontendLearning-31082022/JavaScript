class ShopCoordinator {
    static KEY_LOCAL_STORE = 'reviews'
    static PRODUCTS_LIST_CLASS = 'products-list'

    static addReview(e) {
        e.preventDefault();
        e = e.target;

        const product = e.querySelectorAll('[class=add-order__name-product')[0].value;
        const review = e.querySelectorAll('[class=add-order__review-text]')[0].value;

        const articles = localStorage.getItem(ShopCoordinator.KEY_LOCAL_STORE);
        const id = articles ? new Map(JSON.parse(articles)).size : 0;

        this.localStorage.putToMap(ShopCoordinator.KEY_LOCAL_STORE, id, { product: product, review: review });

        e.querySelectorAll('[class=add-order__name-product]')[0].value = '';
        e.querySelectorAll('[class=add-order__review-text]')[0].value = '';
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
        },
        removeFromMap: function (localStokeKey, id) {
            let stored = localStorage.getItem(localStokeKey);
            if (!stored) return;

            const map = new Map(JSON.parse(stored));
            map.delete(id);

            stored = JSON.stringify(Array.from(map.entries()));
            localStorage.setItem(ShopCoordinator.KEY_LOCAL_STORE, stored);
        }
    }

    constructor() {
        this.products = new Map();
        this.reviews = new Map();
        this.products_list_dom = document.querySelectorAll('[class=products-list]')[0];
        window.shopCoordinator = this;
    }

    loadArticlesProducts() {
        const articles = localStorage.getItem(ShopCoordinator.KEY_LOCAL_STORE);
        if (articles) this.reviews = new Map(JSON.parse(articles));

        this.#initDom();
    }

    #initDom() {
        [...this.reviews.keys()].forEach(key => {
            const reviewObj = this.reviews.get(key);

            const productAlreadyAdded = this.products.has(reviewObj.product);
            if (!productAlreadyAdded) {
                const productContainer = document.createElement("div");
                productContainer.classList.add('product');
                productContainer.innerHTML = `<div class="product__name"> ${reviewObj.product} </div>
                <details class="product__reviews" open>
                <summary data-open="скрыть отзывы" data-close="показать отзывы"></summary>
                </details>
                 `;
                this.products_list_dom.appendChild(productContainer);
                this.products.set(reviewObj.product, {
                    name: reviewObj.product,
                    dom: productContainer,
                    reviews_list: [],
                    addReview: function (review) {
                        this.reviews_list.push(review);
                        this.dom.querySelectorAll('[class=product__reviews]')[0].appendChild(review.dom);
                    },
                    deleteReview: (key) => {
                        const reviewObj = this.reviews.get(key);
                        const product = reviewObj.product;

                        reviewObj.destroyDom();
                        this.reviews.delete(key);
                        product.reviews_list.splice(product.reviews_list.indexOf(reviewObj), 1);
                        ShopCoordinator.localStorage.removeFromMap(ShopCoordinator.KEY_LOCAL_STORE, key);

                        const destroyIfNoReviews = () => {
                            if (product.reviews_list.length == 0) {
                                this.products.delete(product.name);
                                product.dom.remove();
                            }
                        };
                        destroyIfNoReviews();
                    },
                });
            }
            const review = document.createElement("div");
            review.classList.add('review');
            reviewObj['dom'] = review;

            const reviewText = document.createElement("div");
            reviewText.classList.add('review-data');
            reviewText.textContent = reviewObj.review;
            review.appendChild(reviewText);

            reviewObj['product'] = this.products.get(reviewObj.product);
            reviewObj['product'].addReview(reviewObj);
            reviewObj['destroyDom'] = function () {
                this.dom.remove();
            }

            const reviewDelBtn = document.createElement("button");
            reviewDelBtn.classList.add('review-remove');
            reviewDelBtn.classList.add('button-alive');
            reviewDelBtn.textContent = 'удалить';
            reviewDelBtn.setAttribute('onclick', `window.shopCoordinator.products.get('${reviewObj['product'].name}')
            .deleteReview(${key})
            `)
            review.appendChild(reviewDelBtn);

            this.reviews.set(key, reviewObj);
        });

    }
}