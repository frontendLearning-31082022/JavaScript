
let id = null;
const apikey = 'TDCuJqpG4FUUcP6Uy-mmEONvlLDx8x5f2JDPL7pIuYo';
const width=400;

async function getNewRandomImg() {
    let res = null;
    const imgObj = await getImgUrl(`https://api.unsplash.com/photos/random?client_id=${apikey}`);
    id = imgObj.obj.id;
    localStorage.setItem('apiImages', JSON.stringify({ date: (new Date).getTime(), id: id }));
}

async function getImgUrl(url) {
    debugger;
    let img_url = null;
    let obj=null;

    await fetch(url)
        .then(response => response.json())
        .then(objX => {
            debugger;
            img_url = objX.urls.regular;
            img_url = img_url.replace(new RegExp("w=\\d*", "gm"), 'w='+width);
            obj=objX;
        })
        .catch(x => { res = x; });
    return Promise.resolve({img_url:img_url,obj:obj});
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
function setImg() {

    getImgUrl(`https://api.unsplash.com/photos/${id}/?client_id=${apikey}`).then(img_src => {
        debugger;
        const el = document.createElement('img');
        el.src =img_src.img_url ;
        el.style=`height: 80vh;`;
        document.getElementById('dayli-img').appendChild(el);
    })

}

document.addEventListener('DOMContentLoaded', function () {
    new Promise((resolve, reject) => {

        debugger;
        if (checkAlready()) {
            resolve();
            return;
        }
        getNewRandomImg().then(x => resolve(x));

    }).then(getted => {
        setImg();
    })
}, false);


