const access_token = 'hzYjC4fI0hTcIVkD3TMbLlrg7nzxSqxGi0VPGiLO4nI';

function DayliImg() {
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
                if (!checkAlready()) {
                    getNewRandomImg().then(x => resolve())
                } else {
                    resolve();
                }
            }).then(finished => {
                return getImgUrl(`https://api.unsplash.com/photos/${idImg}/?client_id=${apikey}`);
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
        await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    alert('responce per hour exceeded');
                    console.log(response);
                    throw new Error(`responce per hour exceeded? ${response}`);
                }

                return response.json();
            })
            .then(objX => {
                debugger;
                objImg = objX;
                idImg = objX.id;
            })
            .catch(er => {
                debugger;
                console.log(er);
            });
        return Promise.resolve();
    }


    function renderImg() {


        // getImgUrl(`https://api.unsplash.com/photos/${idImg}/?client_id=${apikey}`).then(img_src => {

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
        likes_count.textContent = objImg.likes;



        daily_container.getElementsByClassName('likes')[0].appendChild(likes_count);

        const likeBtn = daily_container.getElementsByClassName('dayli-img__like-btn')[0];
        likeBtn.setAttribute('onclick', `dayliImgObj.likeSwitch(this)`);
        likeBtn.setAttribute('liked', objImg.liked_by_user);
        // })

    }

    function likeSwitch(event) {
        DayliImg.prototype.likes.switchLike(event, { idImg: idImg, apikey: apikey });
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
        // const newLikeState = !Boolean(domEl.getAttribute('liked'));
        const newLikeState = !(domEl.getAttribute('liked') == 'true');

        fetch(`https://api.unsplash.com/photos/${cntx.idImg}/like?client_id=${cntx.apikey}`, {
            method: newLikeState ? 'POST' : 'DELETE',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res => {
            if (!(res.statusText != 'Created' | res.statusText != 'OK')) throw new Exception(res);
            domEl.setAttribute('liked', newLikeState);
            DayliImg.prototype.likes.getLikesCount(cntx.idImg, cntx.apikey);
        }).catch(er => {
            console.log(er);
        });
    },
    getLikesCount: async function (idImg, apikey) {

        debugger;
        await fetch(`https://api.unsplash.com/photos/${idImg}/?client_id=${apikey}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(response => response.json())
            .then(objX => {
                debugger;
                const daily_container = document.getElementById('dayli-img');
                daily_container.getElementsByClassName('likes__count')[0].textContent = objX.likes;
            })
            .catch(x => { console.log(x); });

    }

};



const dayliImgObj = DayliImg();
dayliImgObj.init();
