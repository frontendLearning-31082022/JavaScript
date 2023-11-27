function DayliImg() {
    const LOCAL_STORE_KEY = 'apiImages';
    const imgExpiresSecs = 1 * 60 * 60 * 24;

    const widthImg = 400;

    let idImg = null;
    let objImg = null;

    const redirect_uri = `http://localhost:${document.location.port}`;

    let fetchAuth = null;
    const loginPromis = DayliImg.prototype.authedFetch({ redirect_uri: redirect_uri }).then(x => fetchAuth = x)

    function loadImg() {
        document.addEventListener('DOMContentLoaded', function () {
            loginPromis.then(x => {
                fetchAuth = x;
                return x;
            }).then(x => {
                if (!checkAlready()) {
                    return getNewRandomImg();
                } else {
                    return Promise.resolve();
                }
            }).then(finished => {
                return getImgUrl(`https://api.unsplash.com/photos/${idImg}/`);
            }).then(finished => {
                renderImg();
            }).catch(er => {
                console.log(er);
            })
        }, false);
    }

    function checkAlready() {
        let alreadyImg = localStorage.getItem(LOCAL_STORE_KEY);
        if (!alreadyImg) return false;

        alreadyImg = JSON.parse(alreadyImg);
        const date = alreadyImg.date;
        if (!date) return false;

        if (((new Date().getTime() - date) / 1000) > imgExpiresSecs) return false;

        idImg = alreadyImg.id;
        return true;
    }

    async function getNewRandomImg() {
        await getImgUrl(`https://api.unsplash.com/photos/random`);
        if (idImg == null) {
            console.error('Не удалось запросить новое изображение');
            return;
        }
        localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify({ date: (new Date).getTime(), id: idImg }));
    }

    async function getImgUrl(url) {
        return fetchAuth(url, {
            method: 'GET'
        }).then(response => {
            if (!response.ok) {
                console.log(response);
                throw new Error(`responce per hour exceeded? ${response}`);
            }
            return response.json();
        }).then(objX => {
            objImg = objX;
            idImg = objX.id;
        }).catch(er => {
            console.log(er);
        });
    }

    function renderImg() {
        const daily_container = document.getElementById('dayli-img');

        const el = document.createElement('img');
        img_url = objImg.urls.regular;
        img_url = img_url.replace(new RegExp("w=\\d*", "gm"), 'w=' + widthImg);
        el.src = img_url;
        el.style = `height: 80vh;  max-width: 80vw;`;
        daily_container.prepend(el);

        const author_container = document.getElementById('dayli-img__author');

        const authorLink = document.createElement('a');
        authorLink.textContent = objImg.user.name;
        authorLink.href = objImg.user.links.html;
        author_container.appendChild(authorLink);

        const likes_count = document.createElement('div');
        likes_count.className = 'likes__count';
        likes_count.textContent = objImg.likes;

        daily_container.getElementsByClassName('likes')[0].appendChild(likes_count);

        const likeBtn = daily_container.getElementsByClassName('dayli-img__like-btn')[0];
        likeBtn.setAttribute('onclick', `dayliImgObj.likeSwitch(this)`);
        likeBtn.setAttribute('liked', objImg.liked_by_user);
    }

    DayliImg.prototype.progressBar.init();
    function likeSwitch(event) {
        DayliImg.prototype.likes.switchLike(event, { idImg: idImg, fetch: fetchAuth });
    }

    const obj = {
        init: loadImg,
        likeSwitch: likeSwitch
    };
    window.dayliImgObj = obj;

    return obj;
}

DayliImg.prototype.likes = {
    switchLike: function (domEl, cntx) {
        const newLikeState = !(domEl.getAttribute('liked') == 'true');

        const serverReturnNoUpdatedData = function () {
            const countBefore = +domEl.parentNode.getElementsByClassName('likes__count')[0].textContent;
            const divLikesCount = domEl.parentNode.getElementsByClassName('likes__count')[0];

            function newCount() {
                const newCount = divLikesCount.textContent;
                if (newCount != countBefore) return;
                console.error(`сервер вернул старое кол-во like's (${newCount})`)
                let newVal = newLikeState ? +countBefore + 1 : +countBefore - 1;
                divLikesCount.innerText = newVal;
            }
            return newCount;
        }();

        DayliImg.prototype.progressBar.on(domEl.parentNode);

        cntx.fetch(`https://api.unsplash.com/photos/${cntx.idImg}/like`, {
            method: newLikeState ? 'POST' : 'DELETE'
        }).then(res => {
            if (!(res.statusText != 'Created' | res.statusText != 'OK')) throw new Exception(res);
            domEl.setAttribute('liked', newLikeState);
            setTimeout(() => {
                DayliImg.prototype.likes.getLikesCount(cntx.idImg, cntx.fetch).then(x => {
                    serverReturnNoUpdatedData();
                    DayliImg.prototype.progressBar.off(domEl.parentNode);
                })
            }, 2000);
        }).catch(er => {
            console.log(er);
        });
    },
    getLikesCount: async function (idImg, fetch) {
        await fetch(`https://api.unsplash.com/photos/${idImg}/`, {
            method: 'GET'
        }).then(response => response.json())
            .then(objX => {
                const daily_container = document.getElementById('dayli-img');
                daily_container.getElementsByClassName('likes__count')[0].textContent = objX.likes;
            })
            .catch(x => { console.log(x); });
    }

};

DayliImg.prototype.authedFetch = async function (cntxt) {
    const apikey = 'TDCuJqpG4FUUcP6Uy-mmEONvlLDx8x5f2JDPL7pIuYo';
    const whiteList = ['https://api.unsplash.com/.*'];

    async function tokenInit() {
        let token = null;

        const urlParams = new URLSearchParams(document.location.search);

        function authByRedirect() {
            const redirect_uri = `http://localhost:${document.location.port}`;
            const authURL = `https://unsplash.com/oauth/authorize?client_id=${apikey}&redirect_uri=${cntxt.
                redirect_uri}&response_type=code&scope=public+write_likes`;

            const argee = confirm(`Вы будете перемещены на сайт unsplash.com для входа в систему.
             Вы согласны ? Необходимо для внесения изменений на сайте unsplash.com(добавлние лайков итд).`);
            if (!argee) return;

            window.location.href = authURL;
        }
        const authCode = urlParams.get('code');
        if (!authCode) authByRedirect();

        let response = await fetch('https://unsplash.com/oauth/token?' +
            `client_id=${apikey}&client_secret=Po8Dyi0F2iXYsp3m1Z5LHrhAzUXFSNWlMT3Y3MOpcuo&redirect_uri=${cntxt.redirect_uri}` +
            `&code=${authCode}&grant_type=authorization_code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(x => {
            if (!x.ok) return x.text().then(x => { return { type: 'error', text: x } });
            return x.json();
        }).then(x => {
            if (x.type == 'error') {
                if (x.text.indexOf('The provided authorization grant is invalid, expired, revoked') > -1) {
                    authByRedirect();
                } else if (x.text.indexOf('Rate Limit Exceeded') > -1) {
                    alert(x.text);
                } else {
                    throw new Error(x.error);
                }
            }

            if (x.error) {
                if (x.error == 'invalid_grant') authByRedirect();
            }
            token = x.access_token;
        }).catch(er => {
            console.log(er);
        })

        function fetchInner(url, options) {
            if (!whiteList.some(x => url.match(x))) throw new Error('url not accessed');

            if (token) {
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers['Authorization'] = `Bearer ${token}`;
            }
            const apiKeyAddToUrl = new URL(url);
            apiKeyAddToUrl.searchParams.append('client_id', apikey);

            return fetch(apiKeyAddToUrl, options);
        }
        return fetchInner;
    }

    const fnFetch = await tokenInit();
    return fnFetch;
}

DayliImg.prototype.progressBar = {
    init: function () {
        let bar = document.createElement('style');
        bar.textContent = ` @-moz-keyframes spinoffPulse {
            0% { -moz-transform:rotate(0deg); }
            100% { -moz-transform:rotate(360deg);  }
        }
        @-webkit-keyframes spinoffPulse {
            0% { -webkit-transform:rotate(0deg); }
            100% { -webkit-transform:rotate(360deg); }
        }
        
        .loading {
            content: "";
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-left: 10px;
            border: dashed;
            display:none;
            -moz-animation: spinoffPulse 1s infinite linear;
            -webkit-animation: spinoffPulse 1s infinite linear;
          }
          .loading-active{
            display:initial;
          }
       
        `;
        document.head.appendChild(bar);
    },
    on: function (domEl) {
        const el = domEl.getElementsByClassName('loading')[0];
        el.classList.add('loading-active');
    },
    off: function (domEl) {
        const el = domEl.getElementsByClassName('loading')[0];
        while (el.classList.contains('loading-active')) el.classList.remove('loading-active');
    }
}