class TicTacToe {
    static class_container = 'tic-tac-toe';
    static class_cell = 'tic-tac-toe__cell';
    static getWindowObj = function () { return window[`${TicTacToe.class_container.replaceAll('-', '_')}`]; }

    constructor() {
        this.firstPlayer = Math.random() < 0.5;
        this.playerX = this.firstPlayer;
        this.gameStopped = false;
        this.gameResult = null;

        this.#genDom();
        this.nodes = [
            [new NodeTicTacToe(0), new NodeTicTacToe(1), new NodeTicTacToe(2)],
            [new NodeTicTacToe(3), new NodeTicTacToe(4), new NodeTicTacToe(5)],
            [new NodeTicTacToe(6), new NodeTicTacToe(7), new NodeTicTacToe(8)]
        ];

        window[`${TicTacToe.class_container.replaceAll('-', '_')}`] = this;
    }

    stopGame() {
        this.gameResult = 'Игра прервана';
        alert(this.gameResult);
    }

    #genDom() {
        const styling = document.createElement('style');
        styling.innerHTML = `
        .${TicTacToe.class_container + '__board'} {
            width: 50vw;
            height: 50vh;
            display: grid;
            grid-template-columns: 20vh 20vh 20vh;
            grid-template-rows: 20vh 20vh 20vh;
        }

        .${TicTacToe.class_cell} {
            border: solid black;
            border-width: 2px;
            font-size: 14vh;
            display: block;
            text-align: center;
              cursor: pointer;
              -ms-user-select: none;
              -webkit-user-select: none;
              user-select: none;
              aspect-ratio: 1/1;
              display: flex;
            align-items: center;
            justify-content: center;
        }
        `;
        document.head.appendChild(styling);

        const playersInfo = document.createElement('div');
        playersInfo.innerText = `Первый игрок - ${this.firstPlayer ? 'X' : 'O'}, второй игрок - ${this.firstPlayer ? 'O' : 'X'}`;
        playersInfo.style = 'font-size: 8px;';
        document.getElementsByClassName(TicTacToe.class_container)[0].appendChild(playersInfo);

        const btn_stopGame = document.createElement('button');
        btn_stopGame.innerText = `Отказаться от игры`
        btn_stopGame.style = 'font-size: 8px;';
        btn_stopGame.setAttribute('onclick', `TicTacToe.getWindowObj().stopGame()`)
        document.getElementsByClassName(TicTacToe.class_container)[0].appendChild(btn_stopGame);

        const curPlayer = document.createElement('div');
        curPlayer.innerText = `Текущий игрок - `;
        curPlayer.className = `current-player`;
        curPlayer.style = 'font-size: 8px; display:flex;';
        document.getElementsByClassName(TicTacToe.class_container)[0].appendChild(curPlayer);
        const curPlayerName = document.createElement('div');
        curPlayerName.className = `current-player__name`;
        curPlayerName.innerText = "Первый игрок";
        curPlayerName.style = 'font-size: 8px;';
        curPlayer.appendChild(curPlayerName);
        this.curPlayerDom = curPlayerName;

        const boardDom = document.createElement('div');
        boardDom.className = TicTacToe.class_container + '__board';
        document.getElementsByClassName(TicTacToe.class_container)[0].appendChild(boardDom);

    }

    get curSymbol() {
        const old = this.playerX;
        this.playerX = !old;
        this.changeUserNameDom();
        return old;
    }
    set curSymbol(val) {
        this.playerX = val;
    }
    changeUserNameDom() {
        this.curPlayerDom.textContent = (this.firstPlayer == this.playerX ? 'Первый' : 'Второй') + ' игрок';
    }

    checkSituation() {
        if (this.gameResult) {
            alert(this.gameResult);
            return;
        }

        this.nodes.forEach(x => {
            this.#defineWinner(x);
        })
        for (let index = 0; index < 3; index++) {
            this.#defineWinner(this.nodes.map(x => x[index]));
        }
        const bN = (i) => { return NodeTicTacToe.getWindowObj(i); };
        this.#defineWinner([bN(0), bN(4), bN(8)]);
        this.#defineWinner([bN(2), bN(4), bN(6)]);


        if (this.nodes.every(x => x.filled)) {
            this.gameResult = 'Ничья!';
            alert(this.gameResult);
            return;
        }
    }
    #defineWinner(row) {
        const rowVal = new Set(row.map(y => {
            if (y == null) {
                debugger;
            }

            return y.symbol
        }));
        if (rowVal.size != 1) return;
        if (rowVal.has(null)) return;
        const winner = rowVal.keys().next().value == (this.firstPlayer ? 'X' : 'O') ? 'первый' : 'второй';
        this.gameResult = `Победитель ${winner} игрок`;
        alert(this.gameResult);
    }

}

class NodeTicTacToe {
    static getWindowObj = function (index) { return window[`${TicTacToe.class_cell.replaceAll('-', '_')}_${index}`]; }
    constructor(index) {
        this.symbol = null;
        this.index = index;
        this.filled = false;

        this.#genDom(index);
        window[`${TicTacToe.class_cell.replaceAll('-', '_')}_${index}`] = this;
    }
    #genDom(index) {
        this.dom = document.createElement('div');
        this.dom.classList.add(TicTacToe.class_cell);
        this.dom.setAttribute("onclick", `NodeTicTacToe.getWindowObj(${index}).draw()`);

        document.getElementsByClassName(TicTacToe.class_container + "__board")[0].appendChild(this.dom);
    }
    draw() {
        if (this.filled) {
            alert('уже заполнено!');
            return;
        }

        this.symbol = TicTacToe.getWindowObj().curSymbol ? 'X' : 'O';
        this.filled = true;

        const textSymbol = document.createElement('span');
        textSymbol.textContent = this.symbol;

        this.dom.appendChild(textSymbol);
        this.dom.classList.add('player_' + this.symbol);
        TicTacToe.getWindowObj().checkSituation();
    }
}