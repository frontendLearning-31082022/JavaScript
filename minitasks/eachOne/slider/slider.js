
const container = document.getElementsByClassName('slider__imgs')[0];
let curImg = 0;
const TRANSITION_DURATION = 2500;
document.documentElement.style.setProperty('--swipe_duration', TRANSITION_DURATION + 'ms');

const pagination = document.createElement('div');
pagination.className = 'slider__pagination';
for (let index = 0; index < container.children.length; index++) {
    const pagItem = document.createElement('div');
    pagItem.className = 'slider__pagination-item';
    pagItem.addEventListener('click',()=>{setImg(index)});
    pagination.appendChild(pagItem);
}
container.appendChild(pagination);


setImg(0);

const infinitySwitch = {
    size: [...container.children].filter(x=>x.tagName=='IMG').length,
    next: function (cur, dir) {
        let newNum = cur + (dir ? 1 : -1);
        newNum = newNum < 0 ? this.size - 1 : newNum;
        newNum = newNum == this.size ? 0 : newNum;

        return newNum;
    }
}

//container.children[curImg];
function switchImg(dirForward) {
    const curElem = container.children[curImg];
    const newIndex = infinitySwitch.next(curImg, dirForward);
    const newElem = container.children[newIndex];

    document.documentElement.style.setProperty('--swipe_away_dir', dirForward ? '100vw' : '-100vw');
    curElem.classList.add('swipeAway');
    setTimeout(() => { curElem.style = 'display: none;'; curElem.classList.remove('swipeAway'); }, TRANSITION_DURATION);

    document.documentElement.style.setProperty('--swipeFrom_0', dirForward ? '-100vw' : '100vw');
    // document.documentElement.style.setProperty('--swipeFrom_100', dirForward ? '0vw' : '-100vw');
    document.documentElement.style.setProperty('--swipeFrom_100', '0vw');

    newElem.classList.add('swipeFrom');
    setTimeout(() => { newElem.classList.remove('swipeFrom'); }, TRANSITION_DURATION);
    newElem.style = 'display: initial;';

    curImg = newIndex;
}
function setImg(num){
    curImg=num;
    [...container.children].filter(x=>x.tagName=='IMG').forEach(x=>x.style='display: none;');
    container.children[num].style = 'display: initial;';
}

document.getElementById('slider__prevImg').onclick = () => switchImg(false);
document.getElementById('slider__nextImg').onclick = () => switchImg(true);