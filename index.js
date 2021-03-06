function drawGrid() {
    let text= "<table class='flex'>";
    for (let i=0; i<=8; i++) {
        text+="<tr class=''>";
        for (let j=0; j<=8; j++) {
            text+="<td>";
            const id = i + '-' + j;
            text+="<input class='choice' type='text' onchange='checkCell(" + i + "," + j + ")' maxlength='1' size='1' id='" +
                id + "' name='" + id + "' value='' />";
            text+="</td>";
        }
        text+="</tr>";
    }
    text+="</table>";
    document.getElementById('container').innerHTML = text;
}

/**
 * Creates every possible choice for initial board
 *
 * @return { boolean } Either we can go ahead with a Sudoku solution
 */
function createChoices() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let choicesArray = [];
            for (let c = 1; c < 10; c++) {
                if (isValid([i,j], c)) {
                    choicesArray.push(c);
                }
            }
            if (choicesArray.length === 0) {
                return false;
            }
            for (let i = choicesArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [choicesArray[i], choicesArray[j]] = [choicesArray[j], choicesArray[i]];
            }
            choices[i][j] = choicesArray
        }
    }
    return true
}

/**
 * Check constrains by row / column / boxes 3x3
 *
 * @param {array} coordinates [row, column] of the current board cell.
 * @param {number} value Tried value at that position. Could be undefined when we check the initial board.
 * @return { boolean } Is the position allow its value or new value
 */
function isValid(coordinates, value) {
    let val = value;
    if (value === undefined) {
        val = board[coordinates[0]][coordinates[1]]; 
    }

    for (let i = 0; i < 9; i++) {
        // Checking row
        if (board[coordinates[0]][i] === val && coordinates[1] !== i && val !== 0) {
            return false
        }
        // Checking column
        if (board[i][coordinates[1]] === val && coordinates[0] !== i && val !== 0) {
            return false
        }
    }

    // Checking 3x3 box
    const boxCoordinates = [Math.floor(coordinates[0]/3), Math.floor(coordinates[1]/3)];

    for (let i = boxCoordinates[0]*3; i < boxCoordinates[0]*3 + 3; i++) {
        for (let j = boxCoordinates[1]*3; j < boxCoordinates[1]*3 + 3; j++) {
            if (board[i][j] === val && (coordinates[0] !== i || coordinates[1] !== j) && val !== 0) {
                return false
            }
        } 
    }

    // All good.
    return true

}

function getValuesFromBoard() {
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
        const coordinates = cell.name.split('-');
        document.getElementById(cell.name).classList.remove('bold');
        board[coordinates[0]][coordinates[1]] = cell.value === '' ? 0 : parseInt(cell.value);
        if (cell.value !== '') {
            document.getElementById(cell.name).classList.add('bold');
        }
    });
}

function pushValuesToBoard() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const id = i + '-' + j;
            document.getElementById(id).value = board[i][j]
        }
    }
}

function checkCell(i,j) {
    getValuesFromBoard();
    if (isValid([i,j])) {
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            if (cell.disabled) {
                cell.disabled = false;
            }
        });
        document.getElementById('resolve').classList.remove('opacity-50', 'cursor-not-allowed');
        displayMessage('')
    } else {
        const id = i + '-' + j;
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            if (cell.name !== id) {
                cell.disabled = true;
            }
        });
        document.getElementById('resolve').classList.add('opacity-50', 'cursor-not-allowed');
        displayMessage('We can\'t solve such sudoku. Please change the last entry.')
    }
}

function nextEmptyCell() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i,j]
            }
        }
    }
    return false
}

function displayMessage(message) {
    document.getElementById('message').innerHTML = message;
}

function reset() {
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
       cell.value = '';
       cell.disabled = false;
    });
    displayMessage('')
}

function random() {
    let emptyCells = [];
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
        const coordinates = cell.name.split('-');
        document.getElementById(cell.name).classList.remove('bold');
        if (board[coordinates[0]][coordinates[1]] !== '') {
            emptyCells.push(coordinates);
        }
    });
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    let val = 0;
    let first = true;
    while (first === true || !isValid(randomCell, val)) {
        first = false;
        val = Math.floor((Math.random() * 9) + 1);
    }
    const id = randomCell[0] + '-' + randomCell[1];
    document.getElementById(id).value = val;
    getValuesFromBoard()

}

function resolve() {
    displayMessage('');
    getValuesFromBoard();
    if (createChoices()) {
        if (backTrackSolve()) {
            pushValuesToBoard();
            return;
        }
    }
    displayMessage('No solution available for that initial board.')
}

function backTrackSolve() {
    let cell = nextEmptyCell();
    if (cell === false) {
        return true
    } 

    for (let i = 0; i < choices[cell[0]][cell[1]].length; i++) {
        item = choices[cell[0]][cell[1]][i];
        if (isValid(cell, item)) {
            board[cell[0]][cell[1]] = item;
            if (backTrackSolve()) {
                return true;
            }
            board[cell[0]][cell[1]] = 0;
        }
    }

    return false
}

let board = Array.from(Array(9), () => new Array(9));

let choices = Array.from(Array(9), () => new Array(9));

drawGrid();

displayMessage('Add manually (or randomly) some values');
