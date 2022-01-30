import React from 'react'
import './Chessboard.css'


class ChessPiece{
    constructor(pieceName, pId, x, y){
        this.pieceName = pieceName
        this.pId = pieceName + pId
        this.x = x
        this.y = y
        this.firstMove = true
        this.pieceImage = "./images/"+pieceName.toString()+".png"
    }
}

//initializing the board
const initializeBoard = (tiles) => {
    // var tiles = new Array(8)
    for (var i = 0; i<8; i++){
        // tiles[i] = new Array(8)
        for (var j=0; j<8; j++){
            if (i===1)
                tiles[i][j] = new ChessPiece("pawn_w", (j+1).toString(), i, j)
            else if (i===6)
                tiles[6][j] = new ChessPiece("pawn_b", (j+1).toString(), i, j)
            else if ((i===0 || i===7) && (j===0 || j===7))
                tiles[i][j] = new ChessPiece(i===0 ? "rook_w": "rook_b", j===0 ? "1" : "2", i, j)
            else if ((i===0 || i===7) && (j===1 || j===6))
                tiles[i][j] = new ChessPiece(i===0 ? "knight_w": "knight_b", j===1 ? "1" : "2", i, j)
            else if ((i===0 || i===7) && (j===2 || j===5))
                tiles[i][j] = new ChessPiece(i===0 ? "bishop_w": "bishop_b", j===2 ? "1" : "2", i, j)
            else if ((i===0 || i===7) && (j===3))
                tiles[i][j] = new ChessPiece(i===0 ? "queen_w": "queen_b", "", i, j)
            else if ((i===0 || i===7) && (j===4))
                tiles[i][j] = new ChessPiece(i===0 ? "king_w": "king_b", "", i, j)
            else
                tiles[i][j] = null
        }
    }
}


const Chesspieces = (props) => {
    
    if (props.tilesData[props.i][props.j])
        return (
            <img className='piece-image' 
            src={props.tilesData[props.i][props.j].pieceImage} 
            alt={props.tilesData[props.i][props.j].pieceName}
            id={props.id}
            onDragStart={props.onDragStart} />
        )
    else
        return <div id={props.id}></div>
}

export default Chesspieces
export {initializeBoard, ChessPiece}
