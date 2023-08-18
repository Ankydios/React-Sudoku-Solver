export const range = (start,end) => {
    const out = [];
    for (let i = start;i<=end;i++) {
        out.push(i)
    }
    return out
} 

export const empty_grid = (dimension,defaultValue=null) => {
    const grid = [];
    for (let i = 0; i<dimension;i++) {
        grid.push([])
        for (let j = 0; j<dimension;j++) {
            grid[i].push(defaultValue)
        }
    }
    return grid
}

export function deepCopyMatrix(matrix) {
    // Create a new array to hold the copied matrix
    const copiedMatrix = [];
  
    // Iterate through each row in the matrix
    for (let i = 0; i < matrix.length; i++) {
      // Create a new row array for the copied matrix
      const newRow = [];
  
      // Iterate through each element in the current row
      for (let j = 0; j < matrix[i].length; j++) {
        // Push the value of the current element into the new row
        newRow.push(matrix[i][j]);
      }
  
      // Push the new row into the copied matrix
      copiedMatrix.push(newRow);
    }
  
    return copiedMatrix;
  }

export function isNumberKey(key) {
    return (
        [
        "1","2","3","4","5","6","7","8","9","Backspace"
        ]
        .includes(key))  
}

export function isArrowKey(key) {
    return (
        ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"]
        .includes(key))  
}

export function convertKey(key) {
    switch(key) {
        case "&":
            return "1"
        case "é":
            return "2"
        case "\"":
            return "3"
        case "'":
            return "4"
        case "(":
            return "5"
        case "-":
            return "6"
        case "è":
            return "7"
        case "_":
            return "8"
        case "ç":
            return "9"
        default:
            return key
    }
}

