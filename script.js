const squares = document.querySelectorAll('.square');
const restartBtn = document.querySelector('#restartButton');
const statusText = document.querySelector('#status');

const choicePrompt = document.querySelector("#play-as")
const choiceX = document.querySelector('#choiceX')
const choiceO = document.querySelector('#choiceO')

let human;
let ai;
let currentPlayer = 'X';
let gameRunning = false;

let matrix = createMatrix();

function fetchSquare(num) {
    return document.getElementById(`sq${num}`)
}

function createMatrix(){
    let grid = [];
    let x = 0;

    for (let i = 0; i < 3; i++) {
        let row = [];
        for (let j = 0 + x; j < 3 + x; j++) {
            row.push(fetchSquare(j));
        }
        grid.push(row);
        x+=3;
    } 
    return grid;
}

function checkWinner() {
    for (let i = 0; i < 2; i++){
        let side = i == 0 ? "X" : "O"
        let x = side == "X" ? 1 : -1

        //horizontal
        if (matrix[0][0].textContent == side && 
            matrix[0][1].textContent == side &&
            matrix[0][2].textContent == side) {
                return x;
        }
        if (matrix[1][0].textContent == side && 
            matrix[1][1].textContent == side &&
            matrix[1][2].textContent == side) {
                return x;
        }
        if (matrix[2][0].textContent == side && 
            matrix[2][1].textContent == side &&
            matrix[2][2].textContent == side) {
                return x;
        }
        // vertical
        if (matrix[0][0].textContent == side && 
            matrix[1][0].textContent == side &&
            matrix[2][0].textContent == side) {
                return x;
        }
        if (matrix[0][1].textContent == side && 
            matrix[1][1].textContent == side &&
            matrix[2][1].textContent == side) {
                return x;
        }
        if (matrix[0][2].textContent == side && 
            matrix[1][2].textContent == side &&
            matrix[2][2].textContent == side) {
                return x;
        }
        // diagonal
        if (matrix[0][0].textContent == side && 
            matrix[1][1].textContent == side &&
            matrix[2][2].textContent == side) {
                return x;
        }
        if (matrix[0][2].textContent == side && 
            matrix[1][1].textContent == side &&
            matrix[2][0].textContent == side) {
                return x;
        }
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j].textContent == "") {
                return null; // game continues
            }
        }
    }
    return 0; // tie
}
function changeSides() {
    currentPlayer = currentPlayer == "X" ? "O" : "X"; 
    statusText.textContent = `${currentPlayer}'S TURN`
}

   
function aiMove() {
    if (ai == currentPlayer) {
        let move;
        if (ai == "O") {
            let best_score = Infinity; 
            for (let i=0; i < matrix.length; i++) {
                for (let j=0; j < matrix[0].length; j++) {
                    if (matrix[i][j].textContent == "") {
                        matrix[i][j].textContent = ai;
                        let score = minimax(true, 0);
                        // undo
                        matrix[i][j].textContent = "";
                        if (score < best_score) {
                            if (score == -1) {
                                matrix[i][j].textContent = ai;
                                return;  
                            }
                            move = [i,j];
                            best_score = score;
                        }
                    }  
                }
            }
        }
        else{
            let best_score = -Infinity; 
            for (let i=0; i < matrix.length; i++) {
                for (let j=0; j <matrix[0].length; j++) {
                    if (matrix[i][j].textContent == "") {
                        matrix[i][j].textContent = ai;
                        let score = minimax(false, 0);
                        // undo
                        matrix[i][j].textContent = "";
                        if (score > best_score) {
                            if (score == 1) {
                                matrix[i][j].textContent = ai; 
                                return; 
                            }
                            move = [i,j];
                            best_score = score;
                        }
                    }  
                }
            }  
        }
        matrix[move[0]][move[1]].textContent = ai;
    }
}

function minimax(isMaximizing, depth) {
    let result = checkWinner();
    if (result != null) {
        return result;
    }
    if (isMaximizing) {
        var best_score = -Infinity;
        for (let i=0; i < matrix.length; i++) {
            for (let j=0; j < matrix[0].length; j++) {
                if (matrix[i][j].textContent == "") {
                    matrix[i][j].textContent = "X";
                    let score = minimax(false, depth+1);
                    // undo
                    matrix[i][j].textContent = "";
                    best_score = Math.max(best_score, score);
                    if (best_score == 1) {
                        return best_score;
                    }
                }
            }
        }
    }
    else {
        var best_score = Infinity;
        for (let i=0; i < matrix.length; i++) {
            for (let j=0; j < matrix[0].length; j++) {
                if (matrix[i][j].textContent == "") {
                    matrix[i][j].textContent = "O";
                    let score = minimax(true, depth+1);
                    // undo
                    matrix[i][j].textContent = "";
                    best_score = Math.min(best_score, score);
                    if (best_score == -1) {
                        return best_score;
                    }
                }
            }
        }  
    }
    return best_score;
}

function humanMove() {
    if (gameRunning) {
        if (currentPlayer == human && this.textContent == "") {
            this.textContent = human;
            if (checkWinner() == null) {
                changeSides();
                aiMove();
                if (checkWinner() != null) {
                    gameRunning = false;
                    statusText.textContent = `${currentPlayer} WINS`;
                    return;
                } 
                changeSides();
            }
            else{
                gameRunning = false;
                statusText.textContent = `${currentPlayer} WINS`;
            }
        }
    }
} 

restartBtn.addEventListener("click", () => {
    currentPlayer = 'X';
    ai = undefined;
    human = undefined;
    squares.forEach(square => square.textContent = "");
    choicePrompt.style.display = "flex";
    statusText.textContent = "X'S TURN";
})

choiceX.addEventListener("click", () => {
    human = 'X';
    ai = "O"
    choicePrompt.style.display = "none";
    gameRunning = true;
})

choiceO.addEventListener("click", () => {
    human = 'O';
    ai = "X"
    choicePrompt.style.display = "none";
    gameRunning = true;
    // ai initiates game
    aiMove();
    changeSides();
})

squares.forEach(square => square.addEventListener("click", humanMove));

