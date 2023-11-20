
const container = document.getElementsByClassName('slider__imgs')[0];
let curImg = 0;
const TRANSITION_DURATION = 500;
let dntBreakSlide=false;

document.documentElement.style.setProperty('--swipe_duration', TRANSITION_DURATION + 'ms');

const pagination = document.createElement('div');
pagination.className = 'slider__pagination';
for (let index = 0; index < container.children.length; index++) {
    const pagItem = document.createElement('div');
    pagItem.className = 'slider__pagination-item';
    pagItem.addEventListener('click', () => { setImg(index) });
    pagination.appendChild(pagItem);
}
container.appendChild(pagination);


setImg(0);

const infinitySwitch = {
    size: [...container.children].filter(x => x.tagName == 'IMG').length,
    next: function (cur, dir) {
        let newNum = cur + (dir ? 1 : -1);
        newNum = newNum < 0 ? this.size - 1 : newNum;
        newNum = newNum == this.size ? 0 : newNum;

        return newNum;
    }
}

//container.children[curImg];
function switchImg(dirForward) {
    if(dntBreakSlide)return;
    dntBreakSlide=true;
    const curElem = container.children[curImg];
    const newIndex = infinitySwitch.next(curImg, dirForward);
    const newElem = container.children[newIndex];


    const xCoord = curElem.getBoundingClientRect().left;
    document.documentElement.style.setProperty('--swipeFrom', xCoord);
    document.documentElement.style.setProperty('--swipeTo', dirForward ? '100vw' : '-100vw');
    curElem.classList.add('swipe');
    setTimeout(() => {
        curElem.style = 'display: none;'; curElem.classList.remove('swipe');

        const ratio = newElem.width / newElem.height;
        const curHeightForImages = curElem.height;
        const leftOffset = (window.innerWidth - (ratio * curHeightForImages)) / 2;
        document.documentElement.style.setProperty('--swipeFrom',dirForward ? '-100vw' : '100vw');
        document.documentElement.style.setProperty('--swipeTo', leftOffset);
        newElem.classList.add('swipe');
        newElem.style = 'display: initial;';
        setTimeout(() => {
            newElem.classList.remove('swipe');
            dntBreakSlide=false;
        }, TRANSITION_DURATION)
    }, TRANSITION_DURATION)

    curImg = newIndex;
}
function setImg(num) {
    curImg = num;
    [...container.children].filter(x => x.tagName == 'IMG').forEach(x => x.style = 'display: none;');
    container.children[num].style = 'display: initial;';
}

document.getElementById('slider__prevImg').onclick = () => switchImg(false);
document.getElementById('slider__nextImg').onclick = () => switchImg(true);