class Popup {
    constructor() {
        this.windo = document.createElement("div");
        this.windo.style = `
        width: 50%;
        height: 50%;
        position: fixed;
        top: 25%;
        left: 25%;
        z-index: 100;
        background-color: #fff;
        text-align: center;
        border: solid;

        display: flex;
        justify-content: center;
        align-items: center;
        `;
        this.text = document.createElement("div");
        this.text.style = `
        height: fit-content;
        font-size: 5cqw;
        font-family: Impact;
        width: 80%;
        `;

        this.windo.appendChild(this.text);

    }

    showAndHide(msg) {
        this.text.textContent = msg;
        document.body.appendChild(this.windo);
        setTimeout(()=>{this.windo.remove();},1000)
    }
}