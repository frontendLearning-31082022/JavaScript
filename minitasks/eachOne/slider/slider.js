class Slider {
    #imgs_container
    #curImgIndex
    #transitDuration
    #dntBreakSlideAction
    #infinitySwitch
    constructor() {
        this.#imgs_container = document.getElementsByClassName('slider__imgs')[0];
        this.#curImgIndex = 0;
        this.transitDuration = 500;
        this.dntBreakSlideAction = false;

        this.#infinitySwitch = {
            size: [...this.#imgs_container.children].filter(x => x.tagName == 'IMG').length,
            next: function (cur, dir) {
                let newNum = cur + (dir ? 1 : -1);
                newNum = newNum < 0 ? this.size - 1 : newNum;
                newNum = newNum == this.size ? 0 : newNum;

                return newNum;
            }
        }

        const pagination = document.createElement('div');
        pagination.className = 'slider__pagination';
        for (let index = 0; index < this.#imgs_container.children.length; index++) {
            const pagItem = document.createElement('div');
            pagItem.className = 'slider__pagination-item';
            pagItem.addEventListener('click', () => { this.#setImg(index) });
            pagination.appendChild(pagItem);
        }
        this.#imgs_container.appendChild(pagination);

        this.#setImg(0);
        document.getElementById('slider__prevImg').onclick = () => this.#switchImg(false);
        document.getElementById('slider__nextImg').onclick = () => this.#switchImg(true);
        window.sliderIMGs = this;
    }

    set transitDuration(ms) {
        this.#transitDuration = ms;
        document.documentElement.style.setProperty('--swipe_duration', this.#transitDuration + 'ms');
    }
    get transitDuration(){
        return this.#transitDuration;
    }

    #setImg(num) {
        this.#curImgIndex = num;
        [...this.#imgs_container.children].filter(x => x.tagName == 'IMG').forEach(x => x.style = 'display: none;');
        this.#imgs_container.children[num].style = 'display: initial;';
    }
    #switchImg(dirForward) {
        if (this.#dntBreakSlideAction) return;
        this.#dntBreakSlideAction = true;
        const curElem = this.#imgs_container.children[this.#curImgIndex];
        const newIndex = this.#infinitySwitch.next(this.#curImgIndex, dirForward);
        const newElem = this.#imgs_container.children[newIndex];


        const xCoord = curElem.getBoundingClientRect().left;
        document.documentElement.style.setProperty('--swipeFrom', xCoord);
        document.documentElement.style.setProperty('--swipeTo', dirForward ? '100vw' : '-100vw');
        curElem.classList.add('swipe');
        setTimeout(() => {
            curElem.style = 'display: none;'; curElem.classList.remove('swipe');

            const ratio = newElem.width / newElem.height;
            const curHeightForImages = curElem.height;
            const leftOffset = (window.innerWidth - (ratio * curHeightForImages)) / 2;
            document.documentElement.style.setProperty('--swipeFrom', dirForward ? '-100vw' : '100vw');
            document.documentElement.style.setProperty('--swipeTo', leftOffset);
            newElem.classList.add('swipe');
            newElem.style = 'display: initial;';
            setTimeout(() => {
                newElem.classList.remove('swipe');
                this.#dntBreakSlideAction = false;
            }, this.transitDuration)
        }, this.transitDuration)

        this.#curImgIndex = newIndex;
    }
}




