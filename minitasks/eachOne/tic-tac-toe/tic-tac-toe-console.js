class TicTacToeConsole extends TicTacToe {
    constructor() {
        var overridedAlert = alert;
        window['alert'] = function (txt) {
            if (txt == 'уже заполнено!') { console.error(txt); return; }
            if (txt.indexOf('Победитель')>-1) {
                console.log(`%c ${txt} `, 'background: #222; color: #bada55');
                window[`${TicTacToe.class_container.replaceAll('-', '_')}`].printBoard();
                return;
            }

            console.log(txt)
        };


        const container = document.createElement('div');
        container.className = 'tic-tac-toe';
        container.style = 'display:none';
        document.body.appendChild(container);

        const consoleMsg = document.createElement('div');
        consoleMsg.innerText = 'Игра доступна в Terminal';
        document.body.appendChild(consoleMsg);
        super();


        console.log('Для запуска введите st()');
        window.st = () => { window[`${TicTacToe.class_container.replaceAll('-', '_')}`].printBoard() };
        window.st = function () {
            const objGame = window[`${TicTacToe.class_container.replaceAll('-', '_')}`];
            while (true) {
                if (objGame.gameResult) break;
                objGame.printNextMove();
            }
        }
    }


    printBoard() {
        const bN = (i) => {
            const obj = window[`${TicTacToe.class_cell.replaceAll('-', '_')}_${i}`];
            return obj.filled ? '\t' + obj.symbol + '\t' : '\t\t'
        };
        console.log(
            `
            Поле игры:
            ${bN(0)}|${bN(1)}|${bN(2)}
            _________________________________________
            ${bN(3)}|${bN(4)}|${bN(5)}
            _________________________________________
            ${bN(6)}|${bN(7)}|${bN(8)}
            `
        );
    }

    printNextMove() {
        this.printBoard();
        console.log(
            `
            Текущий игрок - ${(this.firstPlayer == this.playerX ? 'Первый' : 'Второй') + ' игрок'} (символ - ${this.playerX ? 'X' : 'O'})
            Введите номер поля от 1 до 9 (во всплывшем модальном окне)
            `
        );

        const input = prompt();
        const regex = /^[1-9]{1}$/gm;
        if (!regex.test(input)) {
            console.log('Неправильный ввод, повторите.');
            return;
        }
        this.#fillCell(+input - 1);
    }

    #fillCell(index) {
        window[`${TicTacToe.class_cell.replaceAll('-', '_')}_${index}`].draw();
    }
}

