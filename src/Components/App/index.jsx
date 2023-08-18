import Grid from '../Grid'
import Button from '../Button'
import { useState } from 'react'
import { empty_grid } from '../../utilities/functions'
import solve from '../../utilities/solver'
const dimension = 9



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

  function reset() {
    setGridState((gridState) => {
      return ({
        gridValues: empty_grid(dimension),
        initialGrid: empty_grid(dimension),
        selectedCell: gridState.selectedCell
      })
    })
  }

  return (
    <div style={{display:"flex", flexDirection:'column', width: "400px", margin:"auto", alignItems:"center"}}>
      <h1 style={{fontFamily:"Roboto",marginBottom:"10px", color:"#007bff"}}>React Sudoku Solver</h1>
      <p style={{fontFamily:"Roboto",marginBottom:"10px"}}>Enter the numbers of your grid then press solve button.</p>

      <div>
      <Grid 
          dimension={dimension} 
          gridState={gridState}
          setGridState={setGridState}
          />
      </div>
      <div style={{display:"flex",justifyContent:"space-around",width:"200px"}}>
      <Button handleClick={()=>handleClick()} value="Solve"/>
      <Button handleClick={()=>reset()} value="Reset"/>
      </div>

    </div>
  );
}