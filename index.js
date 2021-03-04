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

function isValid(localBoard, coordinates, value) {
    let val = value;
    if (value === undefined) {
        val = localBoard[coordinates[0]][coordinates[1]]; 
    }

    for (let i = 0; i < 9; i++) {
        // Checking row
        if (localBoard[coordinates[0]][i] === val && coordinates[1] !== i && val !== 0) {
            return false
        }
        // Checking column
        if (localBoard[i][coordinates[1]] === val && coordinates[0] !== i && val !== 0) {
            return false
        }
    }

    // Checking 3x3 box
    const boxCoordinates = [Math.floor(coordinates[0]/3), Math.floor(coordinates[1]/3)];

    for (let i = boxCoordinates[0]*3; i < boxCoordinates[0]*3 + 3; i++) {
        for (let j = boxCoordinates[1]*3; j < boxCoordinates[1]*3 + 3; j++) {
            if (localBoard[i][j] === val && (coordinates[0] !== i || coordinates[1] !== j) && val !== 0) {
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
        board[coordinates[0]][coordinates[1]] = cell.value === '' ? 0 : parseInt(cell.value); 
    });
}

function pushValuesToBoard(localBoard) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const id = i + '-' + j;
            document.getElementById(id).value = localBoard[i][j]
        }
    }
}

function checkCell(i,j) {
    getValuesFromBoard();
    if (isValid(board,[i,j])) {
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            if (cell.disabled) {
                cell.disabled = false;
            }
        });
        document.getElementById('resolve').classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        const id = i + '-' + j;
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            if (cell.name !== id) {
                cell.disabled = true;
            }
        });
        document.getElementById('resolve').classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function nextEmptyCell(localBoard) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (localBoard[i][j] === 0) {
                return [i,j]
            }
        }
    }
    return false
}

function reset() {
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
       cell.value = '';
       cell.disabled = false;
    });
}

function resolve() {
    getValuesFromBoard();
    if (backTrakResolution(board)) {
        pushValuesToBoard(board)
    }
}

function backTrakResolution(localBoard) {
    let cell = nextEmptyCell(localBoard);
    

    if (cell === false) {
        return true
    } 

    for (let i = 1; i < 10; i++) {
        if (isValid(localBoard, cell, i)) {
            localBoard[cell[0]][cell[1]] = i;
            if (backTrakResolution(localBoard)) {
                return true;
            }
            console.log(cell, i);
            localBoard[cell[0]][cell[1]] = 0;
        }
    }

    return false
}

let board = Array.from(Array(9), () => new Array(9));

drawGrid();
