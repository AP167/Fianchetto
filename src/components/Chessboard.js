import React from 'react'
import './Chessboard.css'
import Chesspieces from './Chesspieces'
import { initializeBoard, ChessPiece } from './Chesspieces'
import { validMove, isCheck, isStalemate, getPlayer, resetState, getNoCapture } from './Moves'
import { pawnPromotion } from './PawnPromotionDialog'
import { showResult } from './ResultDialog'
import * as engine from '../Engine/myEngine'


const rows = ["1", "2", "3", "4", "5", "6", "7", "8"]
const reverseRows = ["8", "7", "6", "5", "4", "3", "2", "1"]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]

var tiles = new Array(8)
for (var i = 0; i<8; i++){
    tiles[i] = new Array(8)
}

initializeBoard(tiles)

var movesList = []

var promotedCountW = 3, promotedCountB = 3
var opponent = "b"
var gameMode = "s"
var gameStarted = true

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

// getLocalData()



const setOpponent = (opp, mode) => {
    opponent = opp
    gameMode = mode
    document.getElementById("play-menu").style.visibility="hidden"
    document.getElementById("play-menu").style.zIndex="-5"
}

const stockfishMove = (predictions) => {
    console.log(predictions)
    var startPos = predictions.get("from")
    var endPos = predictions.get("to")
    var start = [parseInt(startPos[1])-1, startPos[0].charCodeAt(0)-97]
    var end = [parseInt(endPos[1])-1, endPos[0].charCodeAt(0)-97]
    var promotion = predictions.get("promotion")
    var newPiece
    if (gameStarted){
        if (tiles[start[0]][start[1]]){
            var piece = tiles[start[0]][start[1]].pId
            console.log(start, end, piece)
            if (validMove(piece, start, end, tiles)){
                console.log("Moving ", tiles[start[0]][start[1]].pId)
                tiles[end[0]][end[1]] = tiles[start[0]][start[1]]
                tiles[start[0]][start[1]] = null
                tiles[end[0]][end[1]].firstMove = false

                if (promotion==="q")
                    newPiece = "queen"
                else if (promotion==="k")
                    newPiece = "knight"
                else if (promotion==="b")
                    newPiece = "bishop"
                else if (promotion==="r")
                    newPiece = "rook"
                
                if (promotion!==""){
                    var count
                    if (pieceColour(piece)==="w"){
                        count = promotedCountW.toString()
                        promotedCountW = (promotedCountW+1)%10
                    } else {
                        count = promotedCountB.toString()
                        promotedCountB = (promotedCountB+1)%10
                    }

                    tiles[end[0]][end[1]] = new ChessPiece(`${newPiece}_${pieceColour(piece)}`, count, end[0], end[1])
                }
                
                    

                movesList.push(startPos+endPos+promotion)
                console.log(movesList)

                Chessboard.setOpponentState(piece)

            } else {
                engine.predict(movesList)
            }
        } else {
            engine.predict(movesList)
        }
    }
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
    movesList[movesList.length - 1] = movesList[movesList.length - 1] + piece[0]
    console.log(movesList)

    document.getElementById("dialog-container").style.visibility="hidden"
    document.getElementById("dialog-container").style.zIndex="-3"

    Chessboard.setNewState(piece)

}



const Chessboard = () => {

    const [turn, setTurn] = React.useState("w")
    const [temp, setTemp] = React.useState(0)
    const [tilesData, setTilesData] = React.useState(tiles)
    // React.useEffect(() => {
    //     localStorage.setItem("boardStatus", JSON.stringify(tilesData))
    // }, [turn, tilesData])

    const setNewState = (newPiece) => {
        setTemp((temp+1)%10)
        setTilesData(tiles)
        if (isStalemate(tiles)){
            if(isCheck(pieceColour(newPiece)==="w" ? "b" : "w", tiles))
              showResult("Checkmate", pieceColour(newPiece))
            else
              showResult("Stalemate", "d")
        }
    }

    Chessboard.setNewState = setNewState

    const setOpponentState = (newPiece) => {
        setTurn(turn==="w" ? "b" : "w")
        setTilesData(tiles)
        if (isStalemate(tiles)){
            if(isCheck(pieceColour(newPiece)==="w" ? "b" : "w", tiles))
              showResult("Checkmate", pieceColour(newPiece))
            else
              showResult("Stalemate", "d")
        }
        if (getPlayer()===opponent){
            console.log("opponents turn")
            engine.predict(movesList)
        }
    }

    Chessboard.setOpponentState = setOpponentState

    const startNewGame = (event) => {
        event.preventDefault()
        console.log("new game started")
        gameStarted = false
        initializeBoard(tiles)
        console.log(tiles)
        setTemp((temp+1)%10)
        setTurn("w")
        setTilesData(tiles)
        movesList = []
        resetState()
        document.getElementById("play-menu").style.visibility="visible"
        document.getElementById("play-menu").style.zIndex="5"
    }

    const checkDraw = (event) => {
        console.log(getNoCapture())
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

        console.log("Mode", gameMode)

        if (getPlayer()!==opponent && validMove(droppedId, start, end, tiles))
        {
            if (droppedAtId.startsWith("tile") || pieceColour(droppedId) !== pieceColour(droppedAtId)){
                setTurn(turn==="w" ? "b" : "w")
                console.log("Moving ", tiles[startX][startY].pId)
                tiles[endX][endY] = tiles[startX][startY]
                tiles[startX][startY] = null
                tiles[endX][endY].firstMove = false
                setTilesData(tiles)

                gameStarted = true

                movesList.push(columns[startY]+rows[startX]+columns[endY]+rows[endX])
                console.log(movesList)

                pawnPromotion(droppedId, end)

                if (isStalemate(tiles)){
                    if(isCheck(pieceColour(droppedId)==="w" ? "b" : "w", tiles))
                      showResult("Checkmate", pieceColour(droppedId))
                    else
                      showResult("Stalemate", "d")
                }
                if (getPlayer()===opponent){
                    console.log("opponents turn")
                    engine.predict(movesList)
                }
            }
        }
    }
    
    const dragStartHandler = (event) => {
        event.dataTransfer.setData("text", event.target.id)    
    }

    return (
    <>
        <button className="game-btn" id="newgame-btn" onClick={(event) => startNewGame(event)}>
            New Game
        </button>
        <button className="game-btn" id="draw-btn" onClick={(event) => checkDraw(event)}>
            {getNoCapture()>=49 ? "Claim" : "Offer"} Draw
        </button>
        <div className="board-container">
        <h3 className="player-turn">
            {`${turn==="w" ? "White" : "Black"}'s turn`}{temp===11 ? "!" : ""}
        </h3>
        <div className="board" id="board">
            {reverseRows.map((row, I) => {
                const i = 7-I
                return (
                    <>
                    {columns.map((column, j) => {
                        return(
                            <div className={`tile ${((i+j)%2===0)?"white-tile":"black-tile"}`} 
                                onDragOver={(event) => allowDrop(event)}
                                onDrop={(event) => drop(event)}
                                id={`tile${i}${j}`} >
                                <span className="rank">{j===0 ? rows[i] : ""}</span>
                                <span className="file">{i===0 ? columns[j] : ""}</span>
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
        </div>
    </>
    )
}

export default Chessboard
export {pieceColour, promotePawnTo, setOpponent}

