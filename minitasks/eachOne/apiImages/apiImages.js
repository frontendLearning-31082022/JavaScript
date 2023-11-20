
let id = null;
const apikey = 'TDCuJqpG4FUUcP6Uy-mmEONvlLDx8x5f2JDPL7pIuYo';
const width = 400;

async function getNewRandomImg() {
    let res = null;
    const imgObj = await getImgUrl(`https://api.unsplash.com/photos/random?client_id=${apikey}`);
    id = imgObj.obj.id;
    localStorage.setItem('apiImages', JSON.stringify({ date: (new Date).getTime(), id: id }));
}

async function getImgUrl(url) {
    let img_url = null;
    let obj = null;

    await fetch(url)
        .then(response => response.json())
        .then(objX => {
            img_url = objX.urls.regular;
            img_url = img_url.replace(new RegExp("w=\\d*", "gm"), 'w=' + width);
            obj = objX;
        })
        .catch(x => { res = x; });
    return Promise.resolve({ img_url: img_url, obj: obj });
}

function checkAlready() {

    let alreadyImg = localStorage.getItem('apiImages');
    if (!alreadyImg) return false;

    alreadyImg = JSON.parse(alreadyImg);
    const date = alreadyImg.date;
    if (!date) return false;

    if (((new Date().getTime() - date) / 1000 / 60 / 60 / 24) >= 1) return false;

    id = alreadyImg.id;
    return true;
}

let accessToken = null;

async function makeLike(cnt) {
    const liked = !(cnt.getAttribute('liked'));


    const redirect_uri = `http://localhost:${document.location.port}`;

    const urlParams = new URLSearchParams(document.location.search);
    const authCode = urlParams.get('code');
    if (!authCode) authByRedirect();


    if(!accessToken){
        let response = await fetch('https://unsplash.com/oauth/token?' +
            `client_id=${apikey}&client_secret=Po8Dyi0F2iXYsp3m1Z5LHrhAzUXFSNWlMT3Y3MOpcuo&redirect_uri=${redirect_uri}` +
            `&code=${authCode}&grant_type=authorization_code`
    
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
                // ,
                // body: JSON.stringify(user)
            }).then(x => {
                // if(!x.ok)throw new Exception(x);
                return x.json()
            })
            .then(x => {
                if (x.error) {
                    if (x.error == 'invalid_grant') authByRedirect();
                }
                accessToken = x.access_token;
                // debugger;
            })
            .catch(er => {
                debugger;
            })

    }



    // 'Authorization': 'Bearer <token>',

    // redirect_uri=https://mywordpressinstall.com/unsplash_callback&response_type=code&scope=public
    fetch(`https://api.unsplash.com/photos/${id}/like?client_id=${apikey}`, {
        method: liked ? 'POST' : 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(res => {
        if ( !(res.statusText != 'Created' | res.statusText != 'OK') ) throw new Exception(res);
        cnt.setAttribute('liked', liked);
        getLikesCount();
    }).catch(er => {
        console.log(er);
    });
}

function authByRedirect() {
    const redirect_uri = `http://localhost:${document.location.port}`;
    const authURL = `https://unsplash.com/oauth/authorize?client_id=${apikey}&redirect_uri=${redirect_uri}&response_type=code&scope=public+write_likes`;

    window.location.href = authURL;
}


function getLikesCount() {
    getImgUrl(`https://api.unsplash.com/photos/${id}/?client_id=${apikey}`).then(img_Obj => {
        const daily_container = document.getElementById('dayli-img');        
        daily_container.getElementsByClassName('likes__count')[0].textContent=img_Obj.obj.likes;
    })
}



function setImg() {

    getImgUrl(`https://api.unsplash.com/photos/${id}/?client_id=${apikey}`).then(img_src => {

        const daily_container = document.getElementById('dayli-img');

        const el = document.createElement('img');
        el.src = img_src.img_url;
        el.style = `height: 80vh;`;
        daily_container.prepend(el);

        const author_container = document.getElementById('dayli-img__author');

        const authorLink = document.createElement('a');
        authorLink.textContent = img_src.obj.user.name;
        authorLink.href = img_src.obj.user.links.html;
        author_container.appendChild(authorLink);

        const likes_count = document.createElement('div');
        likes_count.className = 'likes__count';
        likes_count.textContent = img_src.obj.likes;
        daily_container.getElementsByClassName('likes')[0].appendChild(likes_count);

        const likeBtn = daily_container.getElementsByClassName('dayli-img__like-btn')[0];
        likeBtn.setAttribute('onclick', `makeLike(this)`);


        // daily_container.getElementsByClassName('dayli-img__like-btn')[0].setAttribute('onclick', () => {
        //     debugger;
        //     // fetch(`https://api.unsplash.com/photos/${id}/like`, {
        //     //     method: 'POST'
        //     // }).then(res=>{
        //     //     debugger;
        //     // }).catch(er=>{
        //     //     console.log(er);
        //     // })
        // });

        // const authorLink = document.createElement('a');
        // authorLink.textContent = img_src.obj.user.name;
        // authorLink.href = img_src.obj.user.links.html;
        // author.appendChild(authorLink);

    })

}

document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve, reject) => {

        if (checkAlready()) {
            resolve();
            return;
        }
        getNewRandomImg().then(x => resolve(x));

    }).then(getted => {
        setImg();
    })
}, false);


