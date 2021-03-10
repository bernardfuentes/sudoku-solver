/**
 * Main execution.
 *
 */
// Box size and number of boxes
const N = 3;

// Arrays used for the main algorithm 
// Store current board state
let board = Array.from(Array(N*N), () => new Array(N*N));
// Store several choices available
let choices = Array.from(Array(N*N), () => new Array(N*N));

// Store current board state
const boardTest3x3 =
    [['9','','4','','','','2','','6'],
     ['','5','','','4','9','','',''],
     ['','','','','','','','',''],
     ['3','','','','','2','','1',''],
     ['','6','1','','','','','','9'],
     ['','','','','8','5','','',''],
     ['','','','','','','','5',''],
     ['7','','','2','1','8','','',''],
     ['1','9','','7','','','','','']];

// Potential choices on each cell
const itemUsed = ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','0'];

// Insert the board table into the UI
drawGrid();

if (N !== 3) {
    document.getElementById('example').classList.add('hidden');
}

displayMessage('Add some values manually, randomly, or choose our example');

/**
 * Draw N*N*N*N cells of the UI board
 *
 * @return { boolean } Optional.
 */
function drawGrid() {
    let text= "<table class=''>";
    for (let i=0; i<N*N; i++) {
        mediumLineClass = '';
        if (i > 0 && (i+1)%N === 0) {
            mediumLineClass = "medium-row-line";
        }
        text+="<tr class='"+ mediumLineClass +"'>";
        for (let j=0; j<N*N; j++) {
            mediumLineClass = '';
            if (j > 0 && (j+1)%N === 0) {
                mediumLineClass = "medium-column-line";
            }
            text+="<td class='"+ mediumLineClass +"'>";
            const id = i + '-' + j;
            text+="<input class='choice' type='text' onchange='checkCell(" + i + "," + j
                + ")' maxlength='1' size='1' id='" + id + "' name='" + id + "' value='' />";
            text+="</td>";
        }
        text+="</tr>";
    }
    text+="</table>";
    document.getElementById('board').innerHTML = text;
    return true;

}

/**
 * Display UI message
 *
 * @param {string} message. Message to display.
 * @return { boolean } Optional.
 */
function displayMessage(message) {
    document.getElementById('message').innerHTML = message;
    return true
}

/**
 * Empty UI grid. Call from UI.
 *
 * @return { boolean } Optional.
 */
function reset() {
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
        cell.value = '';
        cell.disabled = false;
    });
    displayMessage('');
    getValuesFromUIBoard();
    return true;
}

/**
 * Fill up the board with an specific example.
 *
 * @return { boolean } Optional.
 */
function example() {
    for (let i = 0; i < N*N; i++) {
        for (let j = 0; j < N * N; j++) {
            board[i][j] = boardTest3x3[i][j];
        }
    }
    displayMessage('');
    pushValuesToUIBoard();
    return true;
}


/**
 * Start solving process. Call from UI
 *
 * @return { boolean } Have we found a solution?
 */
function resolve() {
    console.time('resolve');
    displayMessage('');
    getValuesFromUIBoard();
    if (createChoices()) {
        if (backTrackSolve()) {
            pushValuesToUIBoard();
            let end = performance.now();
            console.timeEnd('resolve');
            return true;
        }
    }
    displayMessage('No solution available for that initial board.');
    return false
}

/**
 * Fill the internal 'board' array from the UI.
 *
 * @return { boolean } true Optional
 */
function getValuesFromUIBoard() {
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
        const coordinates = cell.name.split('-');
        document.getElementById(cell.name).classList.remove('bold');
        board[coordinates[0]][coordinates[1]] = cell.value;
        if (cell.value !== '') {
            document.getElementById(cell.name).classList.add('bold');
        }
    });
    return true
}

/**
 * Fill the UI board from 'board' array
 *
 * @return { boolean } true Optional
 */
function pushValuesToUIBoard() {
    for (let i = 0; i < N*N; i++) {
        for (let j = 0; j < N*N; j++) {
            const id = i + '-' + j;
            document.getElementById(id).value = board[i][j]
        }
    }
    return true
}

/**
 * Creates every possible choices for each initial board cell. The choice values are randomized.
 *
 * @return { boolean } Can we start the solving process, or there is not a solution.
 */
function createChoices() {
    for (let i = 0; i < N*N; i++) {
        for (let j = 0; j < N*N; j++) {
            let choicesArray = [];
            for (let c = 0; c < N*N; c++) {
                if (isValid([i,j], itemUsed[c])) {
                    choicesArray = [itemUsed[c], ...choicesArray];
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
 * Check if the last manual entry respects all constrains. Display a message.
 *
 * @param {number} i Entry row.
 * @param {number} j Entry column.
 * @return { boolean } Is the position correct?
 */
function checkCell(i,j) {
    getValuesFromUIBoard();
    if (isValid([i,j])) {
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            if (cell.disabled) {
                cell.disabled = false;
            }
        });
        document.getElementById('resolve').classList.remove('opacity-50', 'cursor-not-allowed');
        displayMessage('');
        return true
    } else {
        const id = i + '-' + j;
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            if (cell.name !== id) {
                cell.disabled = true;
            }
        });
        document.getElementById('resolve').classList.add('opacity-50', 'cursor-not-allowed');
        displayMessage('We can\'t solve such sudoku. Please change the last entry.');
        return false;
    }
}

/**
 * Check constrains by row / column / boxes 3x3.
 * This function can be used:
 *       - to check manual entry (value === undefined)
 *       - to check that position during the solving process
 *
 * @param {array} coordinates [row, column] of the current board cell.
 * @param {string} value Tried value at that position. Could be undefined when we check the initial board.
 * @return { boolean } Is the position allowing its value or a new one.
 */
function isValid(coordinates, value) {
    let val = value;
    if (value === undefined) {
        val = board[coordinates[0]][coordinates[1]]; 
    }

    for (let i = 0; i < N*N; i++) {
        // Checking row
        if (board[coordinates[0]][i] === val && coordinates[1] !== i && val !== '') {
            return false
        }
        // Checking column
        if (board[i][coordinates[1]] === val && coordinates[0] !== i && val !== '') {
            return false
        }
    }

    // Checking NxN box
    const boxCoordinates = [Math.floor(coordinates[0]/N), Math.floor(coordinates[1]/N)];

    for (let i = boxCoordinates[0]*N; i < boxCoordinates[0]*N + N; i++) {
        for (let j = boxCoordinates[1]*N; j < boxCoordinates[1]*N + N; j++) {
            if (board[i][j] === val && (coordinates[0] !== i || coordinates[1] !== j) && val !== '') {
                return false
            }
        } 
    }

    // All good.
    return true
}

/**
 * Find out the first empty cell from left top corner.
 *
 * @return { boolean } the cell coordinate / false if no empty cell available.
 */
function nextEmptyCell() {
    for (let i = 0; i < N*N; i++) {
        for (let j = 0; j < N*N; j++) {
            if (board[i][j] === '') {
                return [i,j]
            }
        }
    }
    return false
}

/**
 * Insert a new value in the board
 *
 * @return { boolean } Whether is possible to insert a new value in the board.
 */
function random() {
    createChoices();
    let emptyCells = [];
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
        let coordinates = cell.name.split('-');
        document.getElementById(cell.name).classList.remove('bold');
        if (board[coordinates[0]][coordinates[1]] === undefined 
            || board[coordinates[0]][coordinates[1]] === '') {
            emptyCells = [coordinates, ...emptyCells]
        }
    });
    for (let i = emptyCells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]];
    }
    while (emptyCells.length) {
        let randomCell = emptyCells[0];
        for (let cellChoices of choices[randomCell[0]][randomCell[1]]) {
            if (isValid(randomCell, cellChoices)) {
                const id = randomCell[0] + '-' + randomCell[1];
                document.getElementById(id).value = cellChoices;
                getValuesFromUIBoard();
                return true;
            }
        }
        emptyCells.shift();
    }
    return false
}

/**
 * Solving process based on a backtrack technique
 *
 * @return { boolean } Have we found a solution?
 */
function backTrackSolve() {
    let cell = nextEmptyCell();
    if (cell === false) {
        return true
    } 

    for (let cellChoices of choices[cell[0]][cell[1]]) {
        if (isValid(cell, cellChoices)) {
            board[cell[0]][cell[1]] = cellChoices;
            if (backTrackSolve()) {
                return true;
            }
            board[cell[0]][cell[1]] = '';
        }
    }

    return false
}

