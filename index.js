function drawGrid() {
    let text= "<table class='flex'>";
    for (let i=0; i<=8; i++) {
        text+="<tr class=''>";
        for (let j=0; j<=8; j++) {
            text+="<td class='box-border h-9 w-9 pl-4 border-4'>";
            const id = i + '-' + j;
            text+="<input class='choice w-6' type='text' onchange='checkCell(" + i + "," + j + ")' maxlength='1' size='1' id='" + 
                id + "' name='" + id + "' value='' />";
            text+="</td>";
        }
        text+="</tr>";
    }
    text+="</table>";
    document.getElementById('container').innerHTML = text;
}

function isValid(coordinates) {
    const value = board[coordinates[0]][coordinates[1]];

    for (let i = 0; i < 9; i++) {
        // Checking row
        if (board[coordinates[0]][i] === value && coordinates[1] !== i && value !== 0) {
            return false
        }
        // Checking column
        if (board[i][coordinates[0]] === value && coordinates[0] !== i && value !== 0) {
            return false
        }
    }

    // Checking 3x3 box
    const boxCoordinates = [Math.floor(coordinates[0]/3), Math.floor(coordinates[1]/3)];
    for (let i = boxCoordinates[0]; i < boxCoordinates[0] + 3; i++) {
        for (let j = boxCoordinates[1]; j < boxCoordinates[1] + 3; j++) {
            if (board[i][j] === value && (coordinates[0] !== i || coordinates[1] !== j) && value !== 0) {
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
    console.log(board);
}

function checkCell(i,j) {
    this.getValuesFromBoard();
    if (this.isValid([i,j])) {
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            console.log(cell.disabled);
            if (cell.disabled) {
                cell.disabled = false;
            }
        });
    } else {
        const id = i + '-' + j;
        console.log(id);
        Array.from(document.getElementsByClassName('choice')).map((cell) => {
            if (cell.name !== id) {
                cell.disabled = true;
            }
        });
    }
}

function reset() {
    Array.from(document.getElementsByClassName('choice')).map((cell) => {
       cell.value = '';
       cell.disabled = false;
    });
}

function resolve() {
    this.getValuesFromBoard();
}

let board = Array.from(Array(9), () => new Array(9));

drawGrid();
