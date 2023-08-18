import Grid from '../Grid'
import Button from '../Button'
import { useState } from 'react'
import { empty_grid } from '../../utilities/functions'
import solve from '../../utilities/solver'
const dimension = 9


const gridStyle = {
    backgroundColor: "black",
    width: "1000px",
    margin: "100px !important",
}

export default function App() {
  const [gridState,setGridState] = useState({
    gridValues: empty_grid(dimension),
    initialGrid: empty_grid(dimension),
    selectedCell: [null,null],
  })

  // console.log(gridState)

  function handleClick() {
    try {
      const solved = solve(gridState.initialGrid)
      setGridState(gridState => {
        return ({
          gridValues: solved,
          initialGrid: gridState.initialGrid,
          selectedCell: gridState.selectedCell
        })
      })
    } catch (error) {
      alert("The grid you provided has no solution")
    }
  }

  return (
    <div style={{display:"flex", flexDirection:'column', width: "1000px", margin:"auto", alignItems:"center"}}>
      <h1 style={{fontFamily:"Roboto",marginBottom:"10px", color:"#007bff"}}>React Sudoku Solver</h1>
      <p style={{fontFamily:"Roboto",marginBottom:"10px"}}>Enter the numbers of your grid then press solve button.</p>
      <Grid 
          dimension={dimension} 
          style={gridStyle}
          gridState={gridState}
          setGridState={setGridState}
          />
      <Button handleClick={()=>handleClick()}/>
    </div>
  );
}