const access_token = 'SKp53Mv9z8p2i_WMxmdFFIPtA1CCnJEfxD-fSilN78A';

function dayliImg() {
    let data = 1;
    const LOCAL_STORE_KEY = 'apiImages';
    const imgExpiresSecs = 1 * 60 * 60 * 24;

    const widthImg = 400;

    let idImg = null;
    let objImg = null;


    const apikey = 'TDCuJqpG4FUUcP6Uy-mmEONvlLDx8x5f2JDPL7pIuYo';

    function loadImg() {

        document.addEventListener('DOMContentLoaded', function () {
            new Promise((resolve, reject) => {

                if (checkAlready()) {
                    getImgUrl(`https://api.unsplash.com/photos/${idImg}/?client_id=${apikey}`).then(x => resolve())
                    return;
                }
                getNewRandomImg().then(x => resolve());

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
        let res = null;
        await getImgUrl(`https://api.unsplash.com/photos/random?client_id=${apikey}`);
        localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify({ date: (new Date).getTime(), id: idImg }));
    }

    async function getImgUrl(url) {
        await fetch(url)
            .then(response => response.json())
            .then(objX => {
                objImg = objX;
                idImg = objX.id;
            })
            .catch(x => { res = x; });
        return Promise.resolve();
    }


    function renderImg() {


        // getImgUrl(`https://api.unsplash.com/photos/${idImg}/?client_id=${apikey}`).then(img_src => {

        debugger;
        const daily_container = document.getElementById('dayli-img');

        const el = document.createElement('img');
        img_url = objImg.urls.regular;
        img_url = img_url.replace(new RegExp("w=\\d*", "gm"), 'w=' + widthImg);
        el.src = img_url;
        el.style = `height: 80vh;`;
        daily_container.prepend(el);

        const author_container = document.getElementById('dayli-img__author');

        const authorLink = document.createElement('a');
        authorLink.textContent = objImg.user.name;
        authorLink.href = objImg.user.links.html;
        author_container.appendChild(authorLink);

        const likes_count = document.createElement('div');
        likes_count.className = 'likes__count';
        likes_count.textContent =objImg.likes;
        daily_container.getElementsByClassName('likes')[0].appendChild(likes_count);

        const likeBtn = daily_container.getElementsByClassName('dayli-img__like-btn')[0];
        likeBtn.setAttribute('onclick', `makeLike(this)`);
        // })

    }


    // img_url = objX.urls.regular;
    // img_url = img_url.replace(new RegExp("w=\\d*", "gm"), 'w=' + width);

    return {
        init: loadImg
    };
}

const dayliImgObj = dayliImg();
debugger;
dayliImgObj.init();
