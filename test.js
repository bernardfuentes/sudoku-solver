const UNASSIGNED = 0;

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

function isSafe(matrix, coordinates, num) {
    let row = coordinates[0];
    let col = coordinates[1];
    return (
        !usedInRow(matrix, row, num) && 
        !usedInCol(matrix, col, num) && 
        !usedInBox(matrix, row - (row % 3), col - (col % 3), num)
    );
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

function solveSudoku(matrix) {
    const cell = nextEmptyCell(matrix);
    console.log(cell);

    // no more "blank" spaces means the puzzle is solved
    if (cell === false) {
        return true;
    }
    let row = cell[0];
    let col = cell[1];

    // try to fill "blank" space with correct num
    for (let num = 1; num <= 9; num++) {
        /* isSafe checks that num isn't already present 
        in the row, column, or 3x3 box (see below) */ 
        // if (isValid(matrix, cell, num) !== isSafe(matrix, cell, num)) {
        //     const myMatrix = matrix;
        //     console.log(isValid(matrix, cell, num),myMatrix,cell, num);
        // }
        if (isValid(matrix, cell, num)) {
            // if (!isValid(matrix, cell, num)) {
            //     // console.log(cell, num);
            // }
            matrix[row][col] = num;

            if (solveSudoku(matrix)) {
                return true;
            }

            /* if num is placed in incorrect position, 
            mark as "blank" again then backtrack with 
            a different num */ 
            matrix[row][col] = UNASSIGNED;
            // console.log([row,col], num, matrix[row])
        }
    }
    return false;
}

function sudokuSolver(matrix) {
    if (solveSudoku(matrix) === true) {
        return matrix;
    }
    return 'NO SOLUTION';
}

const sudokuGrid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0], 
];

console.log(sudokuSolver(sudokuGrid));


