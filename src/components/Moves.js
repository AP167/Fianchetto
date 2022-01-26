import React from 'react'
import { pieceColour } from './Chessboard'

var player = "w"

const validPlayer = (piece) => {
  return pieceColour(piece)===player
}

const pawnMove = (piece, start, end, tiles) => {
  var x = end[0] - start[0]
  var y = end[1] - start[1]
  var sign = pieceColour(piece)==="w" ? 1 : -1
  if (tiles[end[0]][end[1]])
    return x===sign && Math.abs(y)===1 //colour of captured piece is already checked in Chessboard.js
  if (x===sign*2 && y===0 && tiles[start[0]][start[1]].firstMove)
    return tiles[start[0]+sign][start[1]]==null && tiles[end[0]][start[1]]==null
  if (x===sign && y===0)
    return tiles[end[0]][start[1]]==null
  return false
}

const rookMove = (start, end, tiles) => {
  var st, ed;
  if (start[0]===end[0]){
    st = Math.min(start[1], end[1])
    ed = Math.max(start[1], end[1])
    for(var j = st+1; j<ed; j++){
      if (tiles[start[0]][j])
        return false
    }
    return true
  } else if (start[1]===end[1]){
    st = Math.min(start[0], end[0])
    ed = Math.max(start[0], end[0])
    for(var i = st+1; i<ed; i++){
      if (tiles[i][start[1]])
        return false
    }
    return true
  }
  return false
}

const knightMove = (start, end) => {
  var x = Math.abs(end[0]-start[0])
  var y = Math.abs(end[1]-start[1])
  return (x===2 && y===1) || (x===1 && y===2)
}

const bishopMove = (start, end, tiles) => {
  if (Math.abs(end[0]-start[0])===Math.abs(end[1]-start[1])){
    var stepI = (end[0]-start[0])/Math.abs(end[0]-start[0])
    var stepJ = (end[1]-start[1])/Math.abs(end[1]-start[1])
    for (var i=start[0]+stepI, j=start[1]+stepJ; i!==end[0]; i+=stepI, j+=stepJ){
      if (tiles[i][j])
        return false
    }
    return true
  }
  return false
}

const queenMove = (start, end, tiles) => {
  return rookMove(start, end, tiles) || bishopMove(start,end, tiles)
}

const kingMove = (start, end) => {
  return Math.abs(end[0]-start[0])<=1 && Math.abs(end[1]-start[1])<=1
}

const validPieceMove = (piece, start, end, tiles) => {
  if (piece.startsWith("pawn"))
    return pawnMove(piece, start, end, tiles)
  if (piece.startsWith("rook"))
    return rookMove(start, end, tiles)
  if (piece.startsWith("knight"))
    return knightMove(start, end)
  if (piece.startsWith("bishop"))
    return bishopMove(start, end, tiles)
  if (piece.startsWith("queen"))
    return queenMove(start, end, tiles)
  if (piece.startsWith("king"))
    return kingMove(start, end)
  return false
}

const validMove = (piece, start, end, tiles) => {
  if (validPieceMove(piece, start, end, tiles) && validPlayer(piece)){
    player = player==="w" ? "b" : "w"
    return true
  }
}

// const pawnPromotion = (piece, pos) => {
//   if (piece.startsWith("pawn")){
//     if (pieceColour(piece)==="w" && pos[0]===7)
//       return true
//     if (pieceColour(piece)==="b" && pos[0]===0)
//       return true
//   }
//   return false
// }


const Moves = () => {
  return <div></div>
}

export default Moves
export {validMove}
