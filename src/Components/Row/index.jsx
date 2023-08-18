import { range } from '../../utilities/functions'
import { Cell } from '../Cell'

const rowStyle = {
    display: "flex"
}

function Row(props) {
    const column_indexes = range(0,props.dimension-1)

    const handleSelection = (row_index, column_index) => {
        props.setGridState((gridState) => {
            return {
                selectedCell: [row_index,column_index],
                gridValues: gridState.gridValues,
                initialGrid: gridState.initialGrid
            }}
        )
    }

    return (
        <div style={rowStyle}>
        {column_indexes.map((column_index) => {
            return <Cell 
                key={`cell_${props.index}_${column_index}`} 
                row_index={props.index} 
                column_index={column_index}
                isSelected={
                    props.gridState.selectedCell[0] === props.index && 
                    props.gridState.selectedCell[1] === column_index
                    }
                handleSelection = {handleSelection}
                value = {
                    props.gridState.gridValues[props.index][column_index]
                }
                isInitial = {
                    (props.gridState.initialGrid[props.index][column_index] !== null)
                }
            />}
            )}
        </div>
    )
}

export default Row