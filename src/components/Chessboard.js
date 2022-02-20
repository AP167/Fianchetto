import React from 'react'
import './styles/Chessboard.css'
import Chesspieces from './Chesspieces'
import { initializeBoard, ChessPiece } from './Chesspieces'
import { validMove, isCheck, isStalemate, getPlayer, resetState, getNoCapture } from './Moves'
import {resetBoardStatus, storeBoardStatus, boardRepeated, popBoardStatus} from './StoreBoardStatus'
import { pawnPromotion } from './PawnPromotionDialog'
import { showResult, getResult, hasGameEnded, resetGameEnded } from './ResultDialog'
import * as engine from '../Engine/myEngine'
import Controls from './Controls'
import { getSoundOn, getHighlightOn } from './Controls'
// import { sendMove } from './Challenge'



// import fetch from 'node-fetch';

// const userAction = async () => {
//   const response = await fetch('https://taytay.pythonanywhere.com/challenge?opponent_username=a', {
//     "username" : "b"
// });
//   console.log(response)
//   //const myJson = await response.json(); //extract JSON from the http response
// }

// userAction();

// var gameStartAudio = new Audio('/assets/sound/GameStart.mp3')
var checkAudio = new Audio('/assets/sound/Check.mp3')
var checkmateAudio = new Audio('/assets/sound/Checkmate.mp3')
var stalemateAudio = new Audio('/assets/sound/Stalemate.mp3')



const rows = ["1", "2", "3", "4", "5", "6", "7", "8"]
const reverseRows = ["8", "7", "6", "5", "4", "3", "2", "1"]
const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]
const WHITE_TILE_COLOUR = "rgb(218, 199, 175)"
const BLACK_TILE_COLOUR = "rgb(165, 129, 100)"
const WHITE_TILE_HIGHLIGHT = "rgb(205, 220, 140)"
const BLACK_TILE_HIGHLIGHT = "rgb(180, 194, 112)"

var tiles = new Array(8)
for (var i = 0; i<8; i++){
    tiles[i] = new Array(8)
}



var movesList = []

var promotedCountW = 3, promotedCountB = 3
var opponent = "b"
var gameMode = "s"
var gameStarted = true 
var boardRepetition = 1
var gameId = ""
var oppPlayer = ""
var myUsername = ""

var origTileColour = [null, null, null, null]

const setUsername = (user1) =>{
    myUsername = user1
}

const getGameId = () => gameId

/* gameStarted is only to stop the stockfish from making a move from the previous 
data after new game btn is clicked */

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


const rotateBoard = (playerSide) => {
    var i, deg
    deg = playerSide==="w" ? "0" : "180"
    document.getElementById("board").style.transform = `rotate(${deg}deg)`
    const tileDiv = document.getElementsByClassName("tile")
    for (i=0; i<tileDiv.length; i++){
        tileDiv[i].style.transform = `rotate(${deg}deg)`
        tileDiv[i].style.outline = "1px solid " + getTileColour(tileDiv[i].id, false)
    }
    const rankW = document.getElementsByClassName("rankW")
    const fileW = document.getElementsByClassName("fileW")
    for (i=0; i<rankW.length; i++){
        rankW[i].style.visibility = playerSide==="w" ? "visible" : "hidden"
        fileW[i].style.visibility = playerSide==="w" ? "visible" : "hidden"
    } 
    const rankB = document.getElementsByClassName("rankB")
    const fileB = document.getElementsByClassName("fileB")
    for (i=0; i<rankB.length; i++){
        rankB[i].style.visibility = playerSide==="b" ? "visible" : "hidden"
        fileB[i].style.visibility = playerSide==="b" ? "visible" : "hidden"
    } 
}




const setOpponent = (opp, mode, gId, player2) => {
    console.log("Opponent is set")
    opponent = opp
    gameMode = mode
    gameId = gId
    oppPlayer = player2
    document.getElementById("play-menu").style.visibility="hidden"
    document.getElementById("play-menu").style.zIndex="-5"
    document.getElementById("stockfish-menu-container").style.visibility="hidden"
    document.getElementById("stockfish-menu-container").style.zIndex="-4"
    document.getElementById("multiplayer-menu-container").style.visibility="hidden"
    document.getElementById("multiplayer-menu-container").style.zIndex="-4"
    document.getElementById("highlight-switch").checked = getHighlightOn()
    document.getElementById("sound-switch").checked = getSoundOn()

    console.log("play menu should be hidden", gameId)
    // rotateBoard(opp==="w" ? "b" : "w")
    if (opp==="w" && mode==="s"){
        gameStarted = true
        engine.predict(movesList)
        rotateBoard("b")
    }

    if (opp==="w" && mode==="m"){
        setTimeout(() => {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
              };
              
              fetch(`https://taytay.pythonanywhere.com/get-opponent-move?game_id=${gameId}&player=${myUsername}`, requestOptions)
                .then(response => response.text())
                .then(result => multiPlayerMove(result))
                .catch(error => multiPlayerMove(error));
        }, 100)
        rotateBoard("b")
    }

    if (opp==="b" && mode==="m"){
        document.getElementById("copy-game-id").value = getGameId()
        document.getElementById("gameid-menu-container").style.visibility="visible"
        document.getElementById("gameid-menu-container").style.zIndex="4"
    }
    // setTimeout(() => {gameStartAudio.play()}, 200)
    // if (gameMode==="m"){
    //     // while(true){
    //         setTimeout(() => {
    //             var requestOptions = {
    //                 method: 'GET',
    //                 redirect: 'follow'
    //               };
                  
    //               fetch(`http://taytay.pythonanywhere.com/get-opponent-move?game_id=${gameId}&player=${myUsername}`, requestOptions)
    //                 .then(response => response.text())
    //                 .then(result => multiPlayerMove(result))
    //                 .catch(error => console.log('error', error));
    //         }, 10000)
            
    //     // }
    // }
}


const multiPlayerMove = (move) => {
    console.log(move, gameId)
    if (move==="threefold")
        showResult("Threefold Repetition", "d")
    else if (move==="fiftymove")
        showResult("Fifty move Rule", "d")
    else if (move==="offer"){
        document.getElementById("offer-menu").style.visibility="visible"
        document.getElementById("offer-menu").style.zIndex="4"
    }
    else if (move==="accept")
        showResult("Draw by mutual agreement", "d")
    else if (move==="reject")
        alert("Your draw offer was rejected")
    else if (move.length===4 || move.length===5){
        var startPos = move[0]+move[1]
        var endPos = move[2]+move[3]
        var start = [parseInt(startPos[1])-1, startPos[0].charCodeAt(0)-97]
        var end = [parseInt(endPos[1])-1, endPos[0].charCodeAt(0)-97]
        var promotion = move[4]
        var newPiece
        console.log("1", tiles[start[0]][start[1]],tiles[end[0]][end[1]])
        if (gameStarted && !hasGameEnded()){
            if (tiles[start[0]][start[1]]){
                var piece = tiles[start[0]][start[1]].pId
                console.log(start, end, piece)
                if (validMove(piece, start, end, tiles)){
                    console.log("2", tiles[start[0]][start[1]],tiles[end[0]][end[1]])
                    console.log("Moving ", tiles[start[0]][start[1]].pId)
                    tiles[end[0]][end[1]] = tiles[start[0]][start[1]]
                    tiles[start[0]][start[1]] = null
                    tiles[end[0]][end[1]].firstMove = false
                    console.log("3", tiles[start[0]][start[1]],tiles[end[0]][end[1]])

                    if (promotion==="q")
                        newPiece = "queen"
                    else if (promotion==="n")
                        newPiece = "knight"
                    else if (promotion==="b")
                        newPiece = "bishop"
                    else if (promotion==="r")
                        newPiece = "rook"
                    
                    if (promotion!=="" && promotion!=="x"){
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

                    console.log("4", tiles[start[0]][start[1]],tiles[end[0]][end[1]])
                    
                        

                    movesList.push(startPos+endPos)
                    console.log(movesList)

                    storeBoardStatus(tiles)
                    boardRepetition = boardRepeated()
                    console.log("repeated", boardRepetition)

                    highlightTiles("tile"+start[0].toString()+start[1].toString(), "tile"+end[0].toString()+end[1].toString())

                    Chessboard.setStockfishState(piece)

                }
            } 
        }
    } else {
        setTimeout(() => {
                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                          };
                          
                          fetch(`https://taytay.pythonanywhere.com/get-opponent-move?game_id=${gameId}&player=${myUsername}`, requestOptions)
                            .then(response => response.text())
                            .then(result => multiPlayerMove(result))
                            .catch(error => multiPlayerMove(error));
                    }, 100)
    }
}

const stockfishMove = (predictions) => {
    console.log(predictions)
    var startPos = predictions.get("from")
    var endPos = predictions.get("to")
    var start = [parseInt(startPos[1])-1, startPos[0].charCodeAt(0)-97]
    var end = [parseInt(endPos[1])-1, endPos[0].charCodeAt(0)-97]
    var promotion = predictions.get("promotion")
    var newPiece
    if (gameStarted && !hasGameEnded()){
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

                storeBoardStatus(tiles)
                boardRepetition = boardRepeated()
                console.log("repeated", boardRepetition)

                highlightTiles("tile"+start[0].toString()+start[1].toString(), "tile"+end[0].toString()+end[1].toString())

                Chessboard.setStockfishState(piece)

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
    movesList[movesList.length - 1] = movesList[movesList.length - 1] + (piece[0]==="k" ? "n" : piece[0])
    console.log(movesList)

    // popBoardStatus()
    storeBoardStatus(tiles)

    document.getElementById("dialog-container").style.visibility="hidden"
    document.getElementById("dialog-container").style.zIndex="-3"

    Chessboard.setNewState(piece)

    if (gameMode==="m"){
        var currMove = movesList[movesList.length-1]
        
        // sendMove(columns[startY]+rows[startX]+columns[endY]+rows[endX], hasGameEnded(), opponent)
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        
        fetch(`https://taytay.pythonanywhere.com/make-move?game_id=${gameId}&player=${myUsername}&move=${currMove}`, requestOptions)
            .catch(error => console.log('error', error));
    }
    if (gameMode==="m"){
        setTimeout(() => {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            
            fetch(`https://taytay.pythonanywhere.com/get-opponent-move?game_id=${gameId}&player=${myUsername}`, requestOptions)
                .then(response => response.text())
                .then(result => multiPlayerMove(result))
                .catch(error => multiPlayerMove(error));
        }, 100)
    }
    
    if (getPlayer()===opponent && gameMode==="s"){
        console.log("opponents turn")
        engine.predict(movesList)
    }

}


const refreshBoard = () => {Chessboard.reloadBoard()}



const getTileColour = (tileId, highlight) => {
    if ((parseInt(tileId[4]) + parseInt(tileId[5]))%2===0){
        return highlight ? WHITE_TILE_HIGHLIGHT : WHITE_TILE_COLOUR
    } else {
        return highlight ? BLACK_TILE_HIGHLIGHT : BLACK_TILE_COLOUR
    }
}


const highlightTiles = (startTile, endTile) => {
    resetTileColour()
    if (getHighlightOn()){
        var newStartTile = document.getElementById(startTile)
        var newEndTile = document.getElementById(endTile)
        origTileColour = [startTile, endTile, getTileColour(startTile, false), getTileColour(endTile, false)]
        newStartTile.style.backgroundColor = getTileColour(startTile, true)
        newStartTile.style.outlineColor = getTileColour(startTile, true)
        newEndTile.style.backgroundColor =  getTileColour(endTile, true)
        newEndTile.style.outlineColor =  getTileColour(endTile, true)
    }
}

const resetTileColour = () => {
    if (origTileColour[0]!==null){
        var oldStartTile = document.getElementById(origTileColour[0])
        var oldEndTile = document.getElementById(origTileColour[1])
        oldStartTile.style.backgroundColor = origTileColour[2]
        oldEndTile.style.backgroundColor = origTileColour[3]
        oldStartTile.style.outlineColor = origTileColour[2]
        oldEndTile.style.outlineColor = origTileColour[3]
    }
    origTileColour = [null, null, null, null]
}


initializeBoard(tiles)
storeBoardStatus(tiles)



const Chessboard = () => {

    const [turn, setTurn] = React.useState("w")
    const [temp, setTemp] = React.useState(0)
    const [tilesData, setTilesData] = React.useState(tiles)
    // React.useEffect(() => {
    //     localStorage.setItem("boardStatus", JSON.stringify(tilesData))
    // }, [turn, tilesData])

    const reloadBoard = () => {
        setTemp((temp+1)%10)
    }
    Chessboard.reloadBoard = reloadBoard

    const currCheckStatus = (piece) => {
        if (isStalemate(tiles)){
            if(isCheck(pieceColour(piece)==="w" ? "b" : "w", tiles)){
                if (getSoundOn())
                    setTimeout(() => {checkmateAudio.play()}, 200)
                showResult("Checkmate", pieceColour(piece))
            } else {
                if (getSoundOn())
                    setTimeout(() => {stalemateAudio.play()}, 200)
                showResult("Stalemate", "d")
            }
        } else {
            if(isCheck(pieceColour(piece)==="w" ? "b" : "w", tiles)){
                if (getSoundOn())
                    setTimeout(() => {checkAudio.play()}, 300)
                console.log("Check")
            }
        }
    }

    const setNewState = (newPiece) => {
        setTemp((temp+1)%10)
        setTilesData(tiles)
        currCheckStatus(newPiece)
        // if (isStalemate(tiles)){
        //     if(isCheck(pieceColour(newPiece)==="w" ? "b" : "w", tiles)){
        //         setTimeout(() => {checkmateAudio.play()}, 200)
        //         showResult("Checkmate", pieceColour(newPiece))
        //     } else {
        //         setTimeout(() => {stalemateAudio.play()}, 200)
        //         showResult("Stalemate", "d")
        //     }
        // } else {
        //     if(isCheck(pieceColour(newPiece)==="w" ? "b" : "w", tiles)){
        //         setTimeout(() => {checkAudio.play()}, 200)
        //         console.log("Check")
        //     }
        // }
    }

    Chessboard.setNewState = setNewState

    const setStockfishState = (newPiece) => {
        setTurn(turn==="w" ? "b" : "w")
        setTilesData(tiles)
        currCheckStatus(newPiece)
        // if (isStalemate(tiles)){
        //     if(isCheck(pieceColour(newPiece)==="w" ? "b" : "w", tiles)){
        //         setTimeout(() => {checkmateAudio.play()}, 200)
        //         showResult("Checkmate", pieceColour(newPiece))
        //     } else {
        //         setTimeout(() => {stalemateAudio.play()}, 200)
        //         showResult("Stalemate", "d")
        //     }
        // } else {
        //     if(isCheck(pieceColour(newPiece)==="w" ? "b" : "w", tiles)){
        //         setTimeout(() => {checkAudio.play()}, 200)
        //         console.log("Check")
        //     }
        // }
        // if (getPlayer()===opponent){
        //     console.log("opponents turn22222")
        //     engine.predict(movesList)
        // }
    }

    Chessboard.setStockfishState = setStockfishState

    const startNewGame = (event) => {
        event.preventDefault()
        console.log("new game started")
        if (opponent==="w"){
            rotateBoard("w")
        }
        gameStarted = false
        initializeBoard(tiles)
        console.log(tiles)
        setTemp((temp+1)%10)
        setTurn("w")
        setTilesData(tiles)
        movesList = []
        boardRepetition = 1
        resetGameEnded()
        resetTileColour()
        resetState()
        resetBoardStatus()
        storeBoardStatus(tiles)
        document.getElementById("play-menu").style.visibility = "visible"
        document.getElementById("play-menu").style.zIndex = "5"
        document.getElementById("draw-btn").style.visibility = "visible"
    }

    const checkDraw = (event) => {
        if (getNoCapture()>=49){
            showResult("Fifty move Rule", "d")
            if (getPlayer()!==opponent && gameMode==="m"){
                
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };
                fetch(`https://taytay.pythonanywhere.com/make-move?game_id=${gameId}&player=${myUsername}&move=fiftymove`, requestOptions)
                .catch(error => console.log('error', error));
            }
        }
        else if(boardRepetition>=3){
            showResult("Threefold Repetition", "d")
            if (getPlayer()!==opponent && gameMode==="m"){
                
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };
                fetch(`https://taytay.pythonanywhere.com/make-move?game_id=${gameId}&player=${myUsername}&move=threefold`, requestOptions)
                .catch(error => console.log('error', error));
            }
        }
        else{
            // document.getElementById("offer-menu").style.visibility="visible"
            // document.getElementById("offer-menu").style.zIndex="4"
            if (gameMode==="m"){
                var requestOptions = {
                    method: 'GET',
                    redirect: 'follow'
                };
                fetch(`https://taytay.pythonanywhere.com/make-move?game_id=${gameId}&player=${myUsername}&move=offer`, requestOptions)
                .catch(error => console.log('error', error));
                // showResult("Draw by mutual agreement", "d")
                
                setTimeout(() => {
                      
                      fetch(`https://taytay.pythonanywhere.com/get-opponent-move?game_id=${gameId}&player=${myUsername}`, requestOptions)
                        .then(response => response.text())
                        .then(result => multiPlayerMove(result))
                        .catch(error => multiPlayerMove(error));
                }, 100)
            }
            
        }
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
        console.log("Game Id", gameId)
        console.log("Opponent", opponent)

        if (droppedAtId.startsWith("tile") || pieceColour(droppedId) !== pieceColour(droppedAtId))
        {
            if (getPlayer()!==opponent && !hasGameEnded() && validMove(droppedId, start, end, tiles)){
                setTurn(turn==="w" ? "b" : "w")
                console.log("Moving ", tiles[startX][startY].pId)
                tiles[endX][endY] = tiles[startX][startY]
                tiles[startX][startY] = null
                tiles[endX][endY].firstMove = false
                setTilesData(tiles)

                gameStarted = true

                movesList.push(columns[startY]+rows[startX]+columns[endY]+rows[endX])
                console.log(movesList)
                highlightTiles(startTile, endTile)

                if (!pawnPromotion(droppedId, end)){
                    storeBoardStatus(tiles)
                    boardRepetition = boardRepeated()
                    console.log("repeated", boardRepetition)

                    

                    currCheckStatus(droppedId)
                    // if (isStalemate(tiles)){
                    //     if(isCheck(pieceColour(droppedId)==="w" ? "b" : "w", tiles)){
                    //         setTimeout(() => {checkmateAudio.play()}, 200)
                    //         showResult("Checkmate", pieceColour(droppedId))
                    //     } else {
                    //         setTimeout(() => {stalemateAudio.play()}, 200)
                    //         showResult("Stalemate", "d")
                    //     }
                    // } else {
                    //     if(isCheck(pieceColour(droppedId)==="w" ? "b" : "w", tiles)){
                    //         setTimeout(() => {checkAudio.play()}, 200)
                    //         console.log("Check")
                    //     }
                    // }
                    if (gameMode==="m"){
                        var currMove = columns[startY]+rows[startX]+columns[endY]+rows[endX]+"x"
                        
                        // sendMove(columns[startY]+rows[startX]+columns[endY]+rows[endX], hasGameEnded(), opponent)
                        var requestOptions = {
                            method: 'GET',
                            redirect: 'follow'
                        };
                        
                        fetch(`https://taytay.pythonanywhere.com/make-move?game_id=${gameId}&player=${myUsername}&move=${currMove}`, requestOptions)
                            .catch(error => console.log('error', error));
                    }
                    if (gameMode==="m"){
                        setTimeout(() => {
                            var requestOptions = {
                                method: 'GET',
                                redirect: 'follow'
                            };
                            
                            fetch(`https://taytay.pythonanywhere.com/get-opponent-move?game_id=${gameId}&player=${myUsername}`, requestOptions)
                                .then(response => response.text())
                                .then(result => multiPlayerMove(result))
                                .catch(error => multiPlayerMove(error));
                        }, 100)
                    }
                    
                    if (getPlayer()===opponent && gameMode==="s"){
                        console.log("opponents turn")
                        engine.predict(movesList)
                    }
                    if (boardRepeated()===5)
                        showResult("Fivefold Repetition", "d")
                    if (getNoCapture()===75)
                        showResult("Seventy-five move rule", "d")

                }

                
            }
        }
    }
    
    const dragStartHandler = (event) => {
        event.dataTransfer.setData("text", event.target.id)    
    }

    return (
    <>
        <div className="control-panel">
            <button className="game-btn" id="newgame-btn" onClick={(event) => startNewGame(event)}>
                New Game
            </button>
            <button className="game-btn" id="draw-btn" onClick={(event) => checkDraw(event)}>
                {getNoCapture()>=49 || boardRepetition>=3 ? "Claim" : "Offer"} Draw
            </button>
            <Controls />
        </div>
        <div className="board-container">
        <h3 className="player-turn">
            {hasGameEnded()? getResult() : `${turn==="w" ? "White" : "Black"}'s turn`}{temp===11 ? "!" : ""}
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
                                <span className={`rank ${j===7? "rankB" : "rankW"}`}>
                                    {j===0 || j===7 ? rows[i] : ""}
                                </span>
                                <span className={`file ${i===7? "fileB" : "fileW"}`}>
                                    {i===0 || i===7 ? columns[j] : ""}
                                </span>
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
export {pieceColour, promotePawnTo, setOpponent, refreshBoard, setUsername, getGameId, multiPlayerMove}

