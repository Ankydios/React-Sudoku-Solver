import Row from '../Row'
import {range, deepCopyMatrix, isArrowKey, isNumberKey, convertKey} from '../../utilities/functions'
import { useEffect } from 'react'


function Grid({dimension,gridState,setGridState}) {
    const row_indexes = range(0,dimension-1)

    const isAnyCellSelected = (gridState.selectedCell[0] !== null)


    useEffect(() => {

        const handleNumberKeyDown = (key) => {
            setGridState((gridState) => {
                let newInitialGrid = deepCopyMatrix(gridState.initialGrid)
                newInitialGrid[gridState.selectedCell[0]][gridState.selectedCell[1]] = (key !== "Backspace") ? key : null
                let newGridValues = deepCopyMatrix(gridState.gridValues)
                newGridValues[gridState.selectedCell[0]][gridState.selectedCell[1]] = (key !== "Backspace") ? key : null
                return {
                    gridValues: newGridValues,
                    initialGrid: newInitialGrid,
                    selectedCell: gridState.selectedCell
                }}
            )
        }

        const handleArrowKeyDown = (key) => {
            setGridState((gridState)=> {
            const newSelectedCell = [...gridState.selectedCell]
            switch(key) {
                case "ArrowRight":
                    newSelectedCell[1] = Math.min(8, newSelectedCell[1]+1)
                    break;
                case "ArrowLeft":
                    newSelectedCell[1] = Math.max(0, newSelectedCell[1]-1)
                    break;
                case "ArrowUp":
                    newSelectedCell[0] = Math.max(0, newSelectedCell[0] - 1); 
                    break;
                case "ArrowDown":
                    newSelectedCell[0] = Math.min(8, newSelectedCell[0]+1)
                    break;
                default:
                    throw new Error(`handleArrowKeyDown a été appelée avec la touche ${key}`)
            }
            return {
                gridValues: gridState.gridValues,
                initialGrid: gridState.initialGrid,
                selectedCell: newSelectedCell
            }})
        }

        const handleKeyDown = (e) => {
            const key = convertKey(e.key)
            if (isAnyCellSelected && isNumberKey(key)) {
                handleNumberKeyDown(key)
            }
            else if (isAnyCellSelected && isArrowKey(key)) {
                handleArrowKeyDown(key)
            }
        }

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, [isAnyCellSelected]);
    
    

    return row_indexes.map((index) => {
        return <Row key={`row_${index}`} 
        index={index} 
        dimension={dimension} 
        gridState={gridState} 
        setGridState={setGridState}/>
    })
}

export default Grid