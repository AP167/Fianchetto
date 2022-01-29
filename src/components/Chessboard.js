import React from 'react'
import './Chessboard.css'
import Chesspieces from './Chesspieces'
import { tiles, ChessPiece } from './Chesspieces'
import { validMove, isCheck, isStalemate } from './Moves'
import { pawnPromotion } from './PawnPromotionDialog'
import { showResult } from './ResultDialog'
import * as engine from '../Engine/myEngine'


const rows = ["1", "2", "3", "4", "5", "6", "7", "8"]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]

var promotedCountW = 3, promotedCountB = 3


const stockfishMove = (predictions) => {
    console.log(predictions)
}
engine.newgame()
engine.listen(stockfishMove)




const pieceColour = (piece) => {
    if (piece[piece.length-1]==="b" || piece[piece.length-2]==="b")
        return "b"
    else
        return "w"
}

const promotePawnTo = (piece, oldPiece, pos) => {
    var count
    if (pieceColour(oldPiece)==="w"){
        count = promotedCountW.toString()
        promotedCountW = (promotedCountW+1)%10
    } else {
        count = promotedCountB.toString()
        promotedCountB = (promotedCountB+1)%10
    }
    tiles[pos[0]][pos[1]] = new ChessPiece(`${piece}_${pieceColour(oldPiece)}`, count, pos[0], pos[1])
    document.getElementById("dialog-container").style.visibility="hidden"
    document.getElementById("dialog-container").style.zIndex="3"
    Chessboard.setNewState(piece)
}


// const getLocalData = () => {
//     const lists = localStorage.getItem("boardStatus")
//     if (lists){
//         var oldData =  JSON.parse(lists)
//         for (var i=0; i<8; i++){
//             for (var j=0; j<8; j++){
//                 tiles[i][j]=oldData[i][j]
//             }
//         }
//     }
// }


const Chessboard = () => {

    // getLocalData()
    const [turn, setTurn] = React.useState("w")
    const [temp, setTemp] = React.useState(0)
    const [tilesData, setTilesData] = React.useState(tiles)
    // React.useEffect(() => {
    //     localStorage.setItem("boardStatus", JSON.stringify(tilesData))
    // }, [turn, tilesData])

    const setNewState = (newPiece) => {
        setTemp((temp+1)%10)
        setTilesData(tiles)
        // if (isStalemate(tiles)){
        //     if(isCheck(pieceColour(newPiece)==="w" ? "b" : "w", tiles))
        //       showResult("Checkmate", pieceColour(newPiece))
        //     else
        //       showResult("Stalemate", "d")
        // }
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

        console.log("Before checking", tiles[startX][startY], tiles[endX][endY])
        engine.predict(["f2f3"])

        if (validMove(droppedId, start, end, tiles))
        {
            if (droppedAtId.startsWith("tile") || pieceColour(droppedId) !== pieceColour(droppedAtId)){
                setTurn(turn==="w" ? "b" : "w")
                console.log("Moving ", tiles[startX][startY].pId)
                tiles[endX][endY] = tiles[startX][startY]
                tiles[startX][startY] = null
                tiles[endX][endY].firstMove = false
                setTilesData(tiles)
                pawnPromotion(droppedId, end)
                if (isStalemate(tiles)){
                    if(isCheck(pieceColour(droppedId)==="w" ? "b" : "w", tiles))
                      showResult("Checkmate", pieceColour(droppedId))
                    else
                      showResult("Stalemate", "d")
                }
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

