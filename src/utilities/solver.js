const range = (start,end) => {
    const out = [];
    for (let i = start;i<=end;i++) {
        out.push(String(i))
    }
    return out
} 

const empty_grid = (dimension,defaultValue=null) => {
    const grid = [];
    for (let i = 0; i<dimension;i++) {
        grid.push([])
        for (let j = 0; j<dimension;j++) {
            grid[i].push(defaultValue)
        }
    }
    return grid
}

function deepCopyMatrix(matrix) {
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

const initialiseCandidates = (dimension,initialGrid) => {
    // fill a matrix with [1,...dimension] where no 
    // number is written in initialGrid and null on the contrary
    const candidates = empty_grid(dimension,range(1,dimension))
    for (let i = 0;i<dimension;i++) {
        for (let j = 0;j<dimension;j++) {
            if (initialGrid[i][j]) {
                candidates[i][j] = null
            }
        }
    }
    return candidates
}

class Solver {
    constructor(initialGrid) {
        this.dimension = initialGrid.length

        //Check that the initial grid is a square
        for (let i = 0;i<this.dimension;i++) {
            if (this.dimension != initialGrid[i].length) {
                throw new Error("A solver has been initialised with a non squared initial grid")
            }}

        this.initialGrid = initialGrid
        this.currentGrid = empty_grid(this.dimension)

        // candidates is a matrix of array which 
        // contains each candidates for a given cell,
        // by convention, it contains [0] at (i,j) if a number is
        // written in currentGrid
        this.candidates = initialiseCandidates(this.dimension,initialGrid) 
    }

    getCellCandidates(rowIndex,columnIndex) {
        return this.candidates[rowIndex][columnIndex]
    }

    deleteCellCandidate(rowIndex,columnIndex,value) {
        this.candidates[rowIndex][columnIndex] = this.candidates[rowIndex][columnIndex].filter((n) => n!=value)
    }

    getRowCandidates(rowIndex) {
        return this.candidates[rowIndex]
    }

    getCurrentRow(rowIndex) {
        return this.currentGrid[rowIndex]
    }

    deleteRowCandidate(rowIndex,value) {
        for (let j = 0;j<this.dimension;j++) {
            if (Array.isArray(this.candidates[rowIndex][j])) {
                this.deleteCellCandidate(rowIndex,j,value)
            }
        }
    }

    getColumnCandidates(columnIndex) {
        const out = []
        for (let i = 0;i < this.dimension ; i++) {
            out.push(this.candidates[i][columnIndex])
        }
        return out
    }

    getCurrentColumn(columnIndex) {
        const out = []
        for (let i = 0;i < this.dimension ; i++) {
            out.push(this.currentGrid[i][columnIndex])
        }
        return out
    }

    deleteColumnCandidate(columnIndex,value) {
        for (let i = 0;i < this.dimension ; i++) {
            if (Array.isArray(this.candidates[i][columnIndex])) {
                this.deleteCellCandidate(i,columnIndex,value)
            }
        }
    }

    _convertBoxIndex(boxIndex) {
        // This function find the rowIndex and columnIndex 
        // of the first cell of the box 
        // boxIndex -> [rowIndex,columnIndex]
        const rowIndex = Math.floor(boxIndex/3) * 3
        const columnIndex = (boxIndex % 3)*3
        return [rowIndex,columnIndex]
    }
    
    _convertToBoxIndex(rowIndex,columnIndex) {
        return Math.floor(columnIndex/3) + Math.floor(rowIndex/3) * 3
    }

    getBandCandidates(boxIndex,rowNumber) {
        // A band is the intersection of a box and a row
        // the row number between 0 and 2 is explained by this scheme 
        // [[band 0]
        //  [band 1]
        //  [band 2]] <-- this is a box
        let [firstCellRowIndex,firstCellColumnIndex] = this._convertBoxIndex(boxIndex)
        firstCellRowIndex += rowNumber
        
        const out = []
        for (let j = firstCellColumnIndex ; j < firstCellColumnIndex+3 ; j++) {
            out.push(this.candidates[firstCellRowIndex][j]) 
        }
        return out
    }

    getCurrentBand(boxIndex,rowNumber) {
        // A band is the intersection of a box and a row
        // the row number between 0 and 2 is explained by this scheme 
        // [[band 0]
        //  [band 1]
        //  [band 2]] <-- this is a box
        let [firstCellRowIndex,firstCellColumnIndex] = this._convertBoxIndex(boxIndex)
        firstCellRowIndex += rowNumber
        
        const out = []
        for (let j = firstCellColumnIndex ; j < firstCellColumnIndex+3 ; j++) {
            out.push(this.currentGrid[firstCellRowIndex][j]) 
        }
        return out
    }

    getStackCandidates(boxIndex,columnNumber) {
        // A stack is the intersection of a box and a column
        // the column number between 0 and 2 is explained by this scheme 
        // [stack 0, stack 1, stack 2] <-- this is a box
        let [firstCellRowIndex,firstCellColumnIndex] = this._convertBoxIndex(boxIndex)
        firstCellColumnIndex += columnNumber
        
        const out = []
        for (let i = firstCellRowIndex ; i < firstCellRowIndex+3 ; i++) {
            out.push(this.candidates[i][firstCellColumnIndex]) 
        }
        return out
    }

    getBoxCandidates(boxIndex) {
        return [...this.getBandCandidates(boxIndex,0),
            ...this.getBandCandidates(boxIndex,1),
            ...this.getBandCandidates(boxIndex,2)]
    }

    getCurrentBox(boxIndex) {
        return [...this.getCurrentBand(boxIndex,0),
            ...this.getCurrentBand(boxIndex,1),
            ...this.getCurrentBand(boxIndex,2)]
    }

    deleteBoxCandidate(boxIndex,value) {
        const [rowIndex,columnIndex] = this._convertBoxIndex(boxIndex)
        for (let i=rowIndex;i<rowIndex+3;i++ ) {
            for (let j=columnIndex;j<columnIndex+3;j++) {
                if (Array.isArray(this.candidates[i][j])) {
                    this.deleteCellCandidate(i,j,value) 
                }
            }
        }
    }

    isComplete() {
        return this.currentGrid.findIndex(row => row.includes(null)) === -1
    }

    hasDuplicates(Arr) {
        return (new Set(Arr)).size !== Arr.length
    }

    isIncompatible() {
        const aux = (i) => {
            if (i===this.dimension) {
                return false
            }
            const Row = this.getCurrentRow(i).filter(val => val!=null)
            const Col = this.getCurrentColumn(i).filter(val => val!=null)
            const Box = this.getCurrentBox(i).filter(val => val!=null)
            const RowCandidates = this.getRowCandidates(i)
            const ColCandidates = this.getColumnCandidates(i)
            const BoxCandidates = this.getBoxCandidates(i)
            if (RowCandidates.filter(candidates => (Array.isArray(candidates)&&candidates.length === 0)).length > 0) {
                return ['Candidates Row', i]
            }
            if (ColCandidates.filter(candidates => (Array.isArray(candidates)&&candidates.length === 0)).length > 0) {
                return ['Candidates Column', i]
            }
            if (BoxCandidates.filter(candidates => (Array.isArray(candidates)&&candidates.length === 0)).length > 0) {
                return ['Candidates Box', i]
            }
            if (this.hasDuplicates(Row)) {
                return ['Row',i]
            }
            if (this.hasDuplicates(Col)) {
                return ['Column',i]
            }
            if (this.hasDuplicates(Box)) {
                return ['Box',i]
            }
            return aux(i+1)
        }
        return aux(0)
    }

    writeNumber(rowIndex,columnIndex,value) {
        // Update the currentGrid
        this.currentGrid[rowIndex][columnIndex] = String(value)

        // Update the candidates
        this.candidates[rowIndex][columnIndex] = null
        this.deleteRowCandidate(rowIndex,value)
        this.deleteColumnCandidate(columnIndex,value)
        this.deleteBoxCandidate(this._convertToBoxIndex(rowIndex,columnIndex),value)
    }

    writeAllNumbersOfAGrid(grid) {
        if (grid.length != this.dimension) {
            throw new Error("Dimension of the grid don't match")
        }
        for (let i = 0; i<this.dimension;i++) {
            for (let j = 0; j<this.dimension; j++) {
                
                if (grid[i][j]) {
                    this.writeNumber(i,j,grid[i][j])
                }
            }
        }
    }

    writeAllNumbersOfAnArray(Arr) {
        // Array of [rowIndex,columnIndex,Value]
        Arr.map(([rowIndex,columnIndex,value]) => {
            this.writeNumber(rowIndex,columnIndex,value)
        })
    }

    countEachCandidates(Region) {
        // A Region is a row, a column or a box.
        let counter = range(1,this.dimension)
        counter = counter.map((n) => [n,0])
        Region.map((cellCandidates) => {
            if (Array.isArray(cellCandidates)) {
                cellCandidates.map(candidate => {
                    counter[candidate-1][1]++
                })
            }
        })
        return counter
    }    

    findIndexOfAValue(value,Region) {
        return [value,Region.findIndex((element)=>{
            return (Array.isArray(element) && element.includes(value))
        })]
    }

    findANishioCandidate() {
        // Return [NishioRow,NishioColumn,NishioValue]
        if (this.isComplete()) {
            throw new Error("You cannot find a Nishio candidate on a solved grid")
        }
        let min = [Infinity,-1,-1,-1]
        for (let i=0;i<this.dimension;i++) {
            for (let j=0;j<this.dimension;j++) {
                if (Array.isArray(this.candidates[i][j]) && this.candidates[i][j].length < min[0]) {
                    min = [this.candidates[i][j].length,i,j,this.candidates[i][j]]
                }
            }
        }
        return [min[1],min[2],min[3]]
    }

    //Here We have the solving functions 
    findAllSingles() {
        const out = []
        for (let i = 0;i<this.dimension;i++) {
            for (let j=0;j<this.dimension;j++) {
                if (this.candidates[i][j] != null && this.candidates[i][j].length == 1) {
                    out.push([i,j,this.candidates[i][j][0]])
                }
            }
        }
        return out
    }

    findHiddenSingleOfARegion(RegionType,RegionIndex) {
        let Region
        switch(RegionType) {
            case 'Row':
                Region = this.getRowCandidates(RegionIndex)   
            break;
            case 'Column':
                Region = this.getColumnCandidates(RegionIndex)
            break;
            case 'Box':
                Region = this.getBoxCandidates(RegionIndex)
            break;
        }
        const counter = this.countEachCandidates(Region)
        const HiddenSinglesValues = counter
            .filter((element) => element[1] == 1)
            .map((element) => element[0])
        // HiddenSingles contains the values of the HiddenSingles
        const HiddenSinglesPositions = HiddenSinglesValues.map(value => this.findIndexOfAValue(value,Region))
        // HiddenSinglesPositions contains [value,RegionIndex]
        const [rowIndex,columnIndex] = this._convertBoxIndex(RegionIndex)
        switch(RegionType) {
            case 'Row':
                return HiddenSinglesPositions.map(([value,columnIndex])=>([RegionIndex,columnIndex,value]))
            case 'Column':
                return HiddenSinglesPositions.map(([value,rowIndex])=>([rowIndex,RegionIndex,value]))
            case 'Box':
                return HiddenSinglesPositions
                    .map(([value,index]) => {
                        if (index<3) {
                            return [rowIndex,columnIndex+index,value]
                        }
                        else if (index<6) {
                            return [rowIndex+1,columnIndex+(index%3),value]
                        }
                        else {
                            return [rowIndex+2,columnIndex+(index%3),value]
                        }
                })
        }
    }

    findAllHiddenSinglesOfARegionType(RegionType) {
        const aux = (i) => {
            if (i === this.dimension) {
                return []
            }
            return this.findHiddenSingleOfARegion(RegionType,i).concat(aux(i+1))
        }
        return aux(0)
    }

    tryToSolve() {
        // console.log('CURRENT')
        // console.log(deepCopyMatrix(this.currentGrid))
        // console.log('CANDIDATES')
        // console.log(deepCopyMatrix(this.candidates))
        if (this.isComplete()) {
            // console.log('The Sudoku has been solved')
            // console.log(deepCopyMatrix(this.currentGrid))
            return this.currentGrid
        }
        if (this.isIncompatible()) {
            // console.error('Incompatible')
            // console.log(this.isIncompatible())
            // console.log(this.currentGrid)
            throw new Error('The grid is incompatible...')
        }
        
        // Singles
        const Singles = this.findAllSingles()
        if (Singles.length > 0) {
            // console.log(`${Singles.length} Singles have been found !`)
            // console.log(Singles)
            this.writeAllNumbersOfAnArray(Singles)
            return this.tryToSolve()
        }

        // HiddenSingles
        // Rows
        const RowHiddens = this.findAllHiddenSinglesOfARegionType('Row')
        if (RowHiddens.length > 0) {
            // console.log(`${RowHiddens.length} Hiddens have been found in Rows !`)
            // console.log(RowHiddens)
            this.writeAllNumbersOfAnArray(RowHiddens)
            return this.tryToSolve()
        }

        // Columns
        const ColumnHiddens = this.findAllHiddenSinglesOfARegionType('Column')
        if (ColumnHiddens.length > 0) {
            // console.log(`${ColumnHiddens.length} Hiddens have been found in Columns !`)
            // console.log(ColumnHiddens)
            this.writeAllNumbersOfAnArray(ColumnHiddens)
            return this.tryToSolve()
        }

        // Boxes
        const BoxHiddens = this.findAllHiddenSinglesOfARegionType('Box')
        if (BoxHiddens.length > 0) {
            // console.log(`${BoxHiddens.length} Hiddens have been found in Boxes !`)
            // console.log(BoxHiddens)
            this.writeAllNumbersOfAnArray(BoxHiddens)
            return this.tryToSolve()
        }

        // Nishio
        
        // console.log("CURRENT",deepCopyMatrix(this.currentGrid))
        // console.log("Candidates",deepCopyMatrix(this.candidates))
        const [nishioRow,nishioColumn,nishioValues] = this.findANishioCandidate()
        // console.error('I try a Nishio',nishioRow,nishioColumn)
        let i = 0
        while (i < nishioValues.length) {
            // console.error('NISHIO VALUE',nishioRow,nishioColumn,nishioValues[i])
            const nishioValue = nishioValues[i]
            const nishioGrid = deepCopyMatrix(this.currentGrid)
            nishioGrid[nishioRow][nishioColumn] = nishioValue
            // console.log(nishioGrid)
            let nishioSolver = new Solver(nishioGrid)
            nishioSolver.writeAllNumbersOfAGrid(nishioGrid)
            try {
                nishioSolver.tryToSolve()
                const solvedGrid = deepCopyMatrix(nishioSolver.currentGrid)
                this.writeAllNumbersOfAGrid(solvedGrid)
                return this.tryToSolve()
            }
            catch (error) {
                // console.log('The Nishio Does not work')
                i++
            }
        }
    }
}

export default function solve(grid) {
    const solv = new Solver(grid)
    solv.writeAllNumbersOfAGrid(grid)
    return solv.tryToSolve()
}



