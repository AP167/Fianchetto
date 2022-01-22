import React from 'react'
import './Chessboard.css'
import Chesspieces from './Chesspieces'
import { tiles } from './Chesspieces'


const rows = ["1", "2", "3", "4", "5", "6", "7", "8"]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]

const allowDrop = (event) => {
    event.preventDefault()
}

const drop = (event) => {
    event.preventDefault()
    var dropped = event.dataTransfer.getData("text")
    event.target.appendChild(document.getElementById(dropped))
}

const dragStartHandler = (event) => {
    event.dataTransfer.setData("text", event.target.id)    
}

const Chessboard = () => {
  return (
    <>
        <div className="board">
            {(rows.reverse()).map((row, I) => {
                const i = 7-I
                return (
                    <>
                    {columns.map((column, j) => {
                        return(
                            <div className={`tile ${((i+j)%2===0)?"white-tile":"black-tile"}`} 
                                onDragOver={(event) => allowDrop(event)}
                                onDrop={(event) => drop(event)}
                                id={`tile${i}${j}`} >
                                <Chesspieces 
                                    i={i} 
                                    j={j} 
                                    id={tiles[i][j]!=null ? tiles[i][j].pId : `empty${i}${j}`}
                                    draggable="true" 
                                    onDragStart={dragStartHandler}
                                     />
                            </div>
                        )
                    })}
                    </>
                )
            })}
        </div>
    </>
  )
}

export default Chessboard

