import React from 'react'
import { pieceColour } from './Chessboard'
// import { tiles } from './Chesspieces'

var moveAudio = new Audio('/assets/sound/Move.mp3')
var castlleAudio = new Audio('/assets/sound/Castling.mp3')
var captureAudio = new Audio('/assets/sound/Capture.mp3')


var player = "w"

var enPassant = [null, null, "no"]
var kW = [0, 4]
var kB = [7, 4]

var noCapture = 0
var castleMove = false

const resetState = () => {
  player = "w"
  enPassant = [null, null, "no"]
  kW = [0, 4]
  kB = [7, 4]
  noCapture = 0
}

const getNoCapture = () => noCapture

const getPlayer = () => player


const validPlayer = (piece) => {
  return pieceColour(piece)===player
}

const validTilePos = (x, y) => {
  return 0<=x && x<8 && 0<=y && y<8
}

const pawnMove = (piece, start, end, tiles, actualMove) => {
  var x = end[0] - start[0]
  var y = end[1] - start[1]
  var sign = pieceColour(piece)==="w" ? 1 : -1


  if (x===sign*2 && y===0 && tiles[start[0]][start[1]].firstMove){
    if (tiles[start[0]+sign][start[1]]==null && tiles[end[0]][start[1]]==null){
      enPassant = [start[0]+sign, start[1], "nextMove"]
      return true
    } 
  }

  if (x===sign && Math.abs(y)===1){
    if (end[0]===enPassant[0] && end[1]===enPassant[1]){

      var check = false
      var temp = tiles[end[0]-sign][end[1]]
      tiles[end[0]-sign][end[1]] = null
      tiles[end[0]][end[1]] = tiles[start[0]][start[1]]
      tiles[start[0]][start[1]] = null

      check = isCheck(pieceColour(piece), tiles)

      tiles[end[0]-sign][end[1]] = temp
      tiles[start[0]][start[1]] = tiles[end[0]][end[1]]
      tiles[end[0]][end[1]] = null

      if (check)
        return false

      if (actualMove)
        tiles[end[0]-sign][end[1]] = null
      return true
    }
    if (tiles[end[0]][end[1]])
      return x===sign && Math.abs(y)===1 //colour of captured piece is already checked in Chessboard.js
  }

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

const kingMove = (piece, start, end, tiles) => {
  var colour = pieceColour(piece)
  if (Math.abs(end[0]-start[0])<=1 && Math.abs(end[1]-start[1])<=1){
    if (colour==="w"){
      kW = end
    } else {
      kB = end
    }
    return true
  }

  const castle = (endJ, stepJ, rookJ) => {
    if (end[0]!==start[0] || end[1]!==endJ)
      return false
    if (!(tiles[start[0]][rookJ] && tiles[start[0]][rookJ].pieceName.startsWith("rook")))
      return false
    if (!(tiles[start[0]][start[1]].firstMove && tiles[start[0]][rookJ].firstMove))
      return false
    for (var j=start[1]+stepJ; j!==rookJ; j+=stepJ){
      if (tiles[start[0]][j])
        return false
    }
    if (isCheck(colour, tiles))
      return false
    if (!isPositionSafe(piece, start, [start[0], start[1]+stepJ], tiles))
      return false
    tiles[start[0]][start[1]+stepJ] = tiles[start[0]][rookJ]
    tiles[start[0]][rookJ] = null
    if (colour==="w"){
      kW = end
    } else {
      kB = end
    }
    castleMove = true
    return true
  } 

  if (castle(2, -1, 0) || castle(6, 1, 7))
    return true
  
  return false
}



const isCheck = (colour, tiles) => {
  var curr
  var pos = colour==="w" ? kW : kB

  const scan = (endI, endJ, stepI, stepJ, attacker) => {
    for (var i=pos[0]+stepI, j=pos[1]+stepJ; i!==endI && j!==endJ; i+=stepI, j+=stepJ){
      curr = tiles[i][j]
      if (curr){
        if (pieceColour(curr.pieceName)!==colour && 
            (curr.pieceName.startsWith(attacker) || curr.pieceName.startsWith("queen"))){
              console.log("under attack of ", i,j , curr.pieceName)
          return true
        }
        break
      }
    }
    return false
  }

  const scanKnight = (I, J) => {
    for (var i = -I; i<=I; i = i + (2*I)){
      for (var j = -J; j<=J; j = j + (2*J)){
        if (validTilePos(pos[0]+i, pos[1]+j)){
          // console.log("checking tile ", pos[0] + i, pos[1] + j, "i, j",i, j)
          curr = tiles[pos[0] + i][pos[1] + j]
          if (curr && pieceColour(curr.pieceName)!==colour && curr.pieceName.startsWith("knight")){
            console.log("under attack of ", i,j , curr.pieceName)
            return true
          }
        }
      }
    }
  }

  const scanPawn = () => {
    var sign = colour==="w" ? 1 : -1
    var i=pos[0], j=pos[1]
    if (validTilePos(i+sign, j-1) && tiles[i+sign][j-1]){
      curr = tiles[i+sign][j-1]
      if (pieceColour(curr.pieceName)!==colour && curr.pieceName.startsWith("pawn")){
        console.log("under attack of ", i+sign, j-1 , curr.pieceName)
        return true
      }
    } 
    if (validTilePos(i+sign, j+1) && tiles[i+sign][j+1]){
      curr = tiles[i+sign][j+1]
      if (pieceColour(curr.pieceName)!==colour && curr.pieceName.startsWith("pawn")){
        console.log("under attack of ", i+sign, j+1 , curr.pieceName)
        return true
      }
    } 
  }

  if (scan(8, 8, 1, 0, "rook") || scan(-1, -1, -1, 0, "rook") || 
      scan(8, 8, 0, 1, "rook") || scan(-1, -1, 0, -1, "rook") || 
      scan(8, 8, 1, 1, "bishop") || scan(-1, 8, -1, 1, "bishop") || 
      scan(8, -1, 1, -1, "bishop") || scan(-1, -1, -1, -1, "bishop") ||
      scanKnight(1, 2) || scanKnight(2, 1) || scanPawn())
    return true
}


const isPositionSafe = (piece, start, end, tiles) => {
  // console.log("checking ", piece, " from ", start, " to ", end)
  var check = false

  var temp = tiles[end[0]][end[1]]
  tiles[end[0]][end[1]] = tiles[start[0]][start[1]]
  tiles[start[0]][start[1]] = null

  if (piece.startsWith("king_w"))
    kW = end
  else if (piece.startsWith("king_b"))
    kB = end
    
  if (isCheck(pieceColour(piece), tiles)){
    console.log(pieceColour(piece),"king under attack")
    check = true
  }

  if (piece.startsWith("king_w"))
    kW = start
  else if (piece.startsWith("king_b"))
    kB = start

  tiles[start[0]][start[1]] = tiles[end[0]][end[1]]
  tiles[end[0]][end[1]] = temp

  return !check
}


const isStalemate = (tiles) => {

  console.log(tiles)

  var colour = player

  const movesLeft = (piece, start, endI, endJ, stepI, stepJ) => {

    for (var i=start[0]+stepI, j=start[1]+stepJ; i!==endI && j!==endJ; i+=stepI, j+=stepJ){
      if (tiles[i][j] && pieceColour(tiles[i][j].pieceName)===colour)
        return false
      if (isPositionSafe(piece, start, [i, j], tiles)){
        console.log(piece + " can be moved")
        return true
      }
    }

    return false
  }

  const knightMovesLeft = (piece, start, I, J) => {
    for (var i = -I; i<=I; i = i + (2*I)){
      for (var j = -J; j<=J; j = j + (2*J)){
        if (validTilePos(start[0]+i, start[1]+j)){
          var end = [start[0] + i, start[1] + j]
          // console.log("checking tile ", end)
          if (!tiles[end[0]][end[1]] || pieceColour(tiles[end[0]][end[1]].pieceName)!==colour){
            if (isPositionSafe(piece, start, end, tiles)){
              console.log(piece + " can be moved to " + end)
              return true
            }
          }
        }
      }
    }
    return false
  }

  const pawnMovesLeft = (piece, start) => {
    var sign = colour==="w" ? 1 : -1
    for (var j=start[1]-1; j<=start[1]+1; j++){
      if (validTilePos(start[0]+sign, j) && isPositionSafe(piece, start, [start[0]+sign, j], tiles)){
        if (pawnMove(piece, start, [start[0]+sign, j], tiles, false)){
          console.log(piece + " can be moved")
          return true
        }
      }
    }
    if (validTilePos(start[0]+(sign*2), start[1]) && 
        isPositionSafe(piece, start, [start[0]+(sign*2), start[1]], tiles)){
      if (pawnMove(piece, start, [start[0]+(sign*2), start[1]], tiles)){
        console.log(piece + " can be moved")
        return true
      }
    }
    return false
  } 

  const kingMovesLeft = (piece, start) => {
    for (var i=start[0]-1; i<=start[0]+1; i++){
      for (var j=start[1]-1; j<=start[1]+1; j++){
        if (i!==start[0] || j!==start[1]){
          if (validTilePos(i, j) && (!tiles[i][j] || pieceColour( tiles[i][j].pieceName)!==colour)){
            if (isPositionSafe(piece, start, [i, j], tiles)){
              console.log(piece + " can be moved")
              return true
            }
          }
        }
      }
    }
    return false
  } 


  for (var i=0; i<8; i++){
    for (var j=0; j<8; j++){
      if (tiles[i][j] && pieceColour(tiles[i][j].pieceName)===colour){
        var piece = tiles[i][j].pieceName
        if (piece.startsWith("pawn")){
          if (pawnMovesLeft(piece, [i, j]))
            return false
        }
        if (piece.startsWith("rook") || piece.startsWith("queen")){
          if (movesLeft(piece, [i, j], 8, 8, 1, 0) || movesLeft(piece, [i, j], -1, -1, -1, 0) ||
              movesLeft(piece, [i, j], 8, 8, 0, 1) || movesLeft(piece, [i, j], -1, -1, 0, -1))
            return false
        }
        if (piece.startsWith("knight")){
          if (knightMovesLeft(piece, [i, j], 1,2) || knightMovesLeft(piece, [i, j], 2,1))
            return false
        }
        if (piece.startsWith("bishop") || piece.startsWith("queen")){
          if (movesLeft(piece, [i, j], 8, 8, 1, 1) || movesLeft(piece, [i, j], -1, 8, -1, 1) ||
              movesLeft(piece, [i, j], 8, -1, 1, -1) || movesLeft(piece, [i, j], -1, -1, -1, -1))
            return false
        }
        if (piece.startsWith("king")){
          if (kingMovesLeft(piece, [i, j]))
            return false
        }
      }
    }
  }
  return true
}




const validPieceMove = (piece, start, end, tiles) => {
  if (piece.startsWith("pawn"))
    return pawnMove(piece, start, end, tiles, true)
  if (piece.startsWith("rook"))
    return rookMove(start, end, tiles)
  if (piece.startsWith("knight"))
    return knightMove(start, end)
  if (piece.startsWith("bishop"))
    return bishopMove(start, end, tiles)
  if (piece.startsWith("queen"))
    return queenMove(start, end, tiles)
  if (piece.startsWith("king"))
    return kingMove(piece, start, end, tiles)
  return false
}

const validMove = (piece, start, end, tiles) => {

  if (start[0]===end[0] && start[1]===end[1])
    return false
  if (!validPlayer(piece))
    return false
  if (!isPositionSafe(piece, start, end, tiles))
    return false


  if (validPieceMove(piece, start, end, tiles)){
    player = player==="w" ? "b" : "w"

    if (enPassant[2]==="nextMove")
      enPassant[2] = "thisMove"
    else if (enPassant[2]==="thisMove")
      enPassant = [null, null, "no"]


    if (tiles[end[0]][end[1]] || piece.startsWith("pawn"))
      noCapture = 0
    else
      noCapture++
    // console.log("NoCapture", noCapture)
    if (tiles[end[0]][end[1]]){
      captureAudio.play()
    } else if (castleMove){
      castleMove = false
      castlleAudio.play()
    } else {
      moveAudio.play()
    }
    
    moveAudio.play()
    return true

  }
}


const Moves = () => {
  return <div></div>
}

export default Moves
export {validMove, isCheck, isStalemate, getPlayer, getNoCapture, resetState}
