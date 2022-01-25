import React from 'react'
import './Chessboard.css'
import Chesspieces from './Chesspieces'
import { tiles } from './Chesspieces'
import { validMove } from './Moves'


const rows = ["1", "2", "3", "4", "5", "6", "7", "8"]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]

const pieceColour = (piece) => {
    if (piece[piece.length-1]==="b" || piece[piece.length-2]==="b")
        return "b"
    else
        return "w"
}

const allowDrop = (event) => {
    event.preventDefault()
}

const drop = (event) => {
    event.preventDefault()
    var droppedId = event.dataTransfer.getData("text")
    var droppedAtId = event.target.id
    var dropped = document.getElementById(droppedId)
    var droppedAt = event.target

    var startTile = dropped.parentElement.id
    var endTile = droppedAtId.startsWith("tile") ? droppedAtId : droppedAt.parentElement.id
    var startX = parseInt(startTile[startTile.length - 2])
    var startY = parseInt(startTile[startTile.length - 1])
    var endX = parseInt(endTile[endTile.length - 2])
    var endY = parseInt(endTile[endTile.length - 1])
    var start = [startX, startY]
    var end = [endX, endY]

    
    if (validMove(droppedId, start, end, tiles))
    {
        if (droppedAtId.startsWith("tile")){
            droppedAt.appendChild(dropped)
            tiles[endX][endY] = tiles[startX][startY]
            tiles[startX][startY] = null
            tiles[endX][endY].firstMove = false
        } 
        else if (pieceColour(droppedId) !== pieceColour(droppedAtId)) {
            var parentTile = droppedAt.parentElement
            droppedAt.remove()
            parentTile.appendChild(dropped)
            tiles[endX][endY] = tiles[startX][startY]
            tiles[startX][startY] = null
            tiles[endX][endY].firstMove = false
        } 
    }
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
export {pieceColour}

