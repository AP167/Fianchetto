import { pieceColour } from './Chessboard'

const totalBoards = 500
var boardStatus = new Array(totalBoards)
var currBoardNum = 0




const resetBoardStatus = () => {
    boardStatus = new Array(totalBoards)
    currBoardNum = 0
}

const storeBoardStatus = (tiles) => {
    boardStatus[currBoardNum] = new Array(64)
    var c = 0
    var boardPiece = ""
    for (var i = 0; i<8; i++){
        for (var j=0; j<8; j++){
            if (!tiles[i][j])
                boardPiece = "_"
            else {
                var piece = tiles[i][j].pId
                if (pieceColour(piece)==="b")
                    boardPiece = piece[0] + piece[piece.length-1]
                else
                    boardPiece = piece[0].toUpperCase() + piece[piece.length-1]
            }
            boardStatus[currBoardNum][c] = boardPiece
            c++
        }
    }
    currBoardNum++
    // console.log(boardStatus)
    // console.log(currBoardNum)
}

const boardRepeated = () => {
    var repetition = 1
    for (var i=0; i<currBoardNum-1; i++){
        var same = 0
        for (var j = 0; j<64; j++){
            if (boardStatus[currBoardNum-1][j]===boardStatus[i][j])
                same++ 
        }
        if (same===64)
            repetition++
        // console.log("checking board ", currBoardNum-1,"with", i)
        // console.log("similarities found:", same, "    repeated yet", repetition)
    }
    return repetition
}

const popBoardStatus  = () => {
    boardStatus[currBoardNum-1] = null
    currBoardNum--
}

export {resetBoardStatus, storeBoardStatus, boardRepeated, popBoardStatus}