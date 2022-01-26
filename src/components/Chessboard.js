import React from 'react'
import './Chessboard.css'
import Chesspieces from './Chesspieces'
import { tiles, ChessPiece } from './Chesspieces'
import { validMove } from './Moves'
import { pawnPromotion } from './PawnPromotionDialog'


const rows = ["1", "2", "3", "4", "5", "6", "7", "8"]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]

var count = 3


const pieceColour = (piece) => {
    if (piece[piece.length-1]==="b" || piece[piece.length-2]==="b")
        return "b"
    else
        return "w"
}

const promotePawnTo = (piece, oldPiece, pos) => {
    tiles[pos[0]][pos[1]] = new ChessPiece(`${piece}_${pieceColour(oldPiece)}`, count.toString(), pos[0], pos[1])
    count++
    document.getElementById("dialog-container").style.visibility="hidden"
    document.getElementById("dialog-container").style.zIndex="3"
    Chessboard.setNewState()
}


// const getLocalData = () => {
//     const lists = localStorage.getItem("mytodolist")
//     if (lists)
//         return JSON.parse(lists)
//     return tiles
// }


const Chessboard = () => {

    // tiles = getLocalData()
    const [turn, setTurn] = React.useState("w")
    const [temp, setTemp] = React.useState(0)
    const [tilesData, setTilesData] = React.useState(tiles)
    // React.useEffect(() => {
    //     localStorage.setItem("boardStatus", JSON.stringify(tiles))
    // }, [tiles])

    const setNewState = () => {
        setTemp((temp+1)%10)
        setTilesData(tiles)
    }

    Chessboard.setNewState = setNewState

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
                // droppedAt.appendChild(dropped)
                setTurn(turn==="w" ? "b" : "w")
                tiles[endX][endY] = tiles[startX][startY]
                tiles[startX][startY] = null
                tiles[endX][endY].firstMove = false
                setTilesData(tiles)
                pawnPromotion(droppedId, end)
            } 
            else if (pieceColour(droppedId) !== pieceColour(droppedAtId)) {
                // var parentTile = droppedAt.parentElement
                // droppedAt.remove()
                // parentTile.appendChild(dropped)
                setTurn(turn==="w" ? "b" : "w")
                tiles[endX][endY] = tiles[startX][startY]
                tiles[startX][startY] = null
                tiles[endX][endY].firstMove = false
                setTilesData(tiles)
                pawnPromotion(droppedId, end)
            } 
        }
    }
    
    const dragStartHandler = (event) => {
        event.dataTransfer.setData("text", event.target.id)    
    }

    return (
    <>
        {`${turn==="w" ? "White" : "Black"}'s turn`}{temp===11 ? "!" : ""}
        <div id="dialog-box"></div>
        <div className="board" id="board">
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
                                    id={tilesData[i][j]!=null ? tilesData[i][j].pId : `empty${i}${j}`}
                                    tilesData={tilesData}
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
export {pieceColour, promotePawnTo}

