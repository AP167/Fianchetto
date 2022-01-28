import React from 'react'
import './PawnPromotionDialog.css'
import { promotePawnTo } from './Chessboard'
import { pieceColour } from './Chessboard'

var promoteTo = null
var oldPiece = null
var pawnPosition = null

const promote = (event) => {
    event.preventDefault()
    var form = document.getElementById("pawn-promotion-form")
    for (var i=0; i<form.length-1; i++){
        if (form.elements[i].checked){
            promoteTo = form.elements[i].value
        }
    }
    if (promoteTo!==null)
        promotePawnTo(promoteTo, oldPiece, pawnPosition)
    else
        alert("Please choose a piece to promote your pawn")
    promoteTo = null
}

const pawnPromotion = (piece, pos) => {
    if (piece.startsWith("pawn")){
      if ((pieceColour(piece)==="w" && pos[0]===7) || (pieceColour(piece)==="b" && pos[0]===0)){
        oldPiece = piece
        pawnPosition = pos
        document.getElementById("dialog-container").style.visibility="visible"
        document.getElementById("dialog-container").style.zIndex="3"
      }
    }
}

const DialogBox = ({props}) => {
  return (
    <div id="dialog-container">
        <form id="pawn-promotion-form">
            <h2 className="prompt">Promote your pawn to</h2>
            <div className="radio-btn-group">
                <span className="radio-btn-container">
                    <input type="radio" id="promote-queen" className="radio-btn" name="promote" value="queen" />
                    <label htmlFor="promote-queen">Queen</label>
                </span>
                <span className="radio-btn-container">
                    <input type="radio" id="promote-knight" className="radio-btn" name="promote" value="knight" />
                    <label htmlFor="promote-knight">Knight</label>
                </span>
                <span className="radio-btn-container">
                     <input type="radio" id="promote-bishop" className="radio-btn" name="promote" value="bishop" />
                    <label htmlFor="promote-bishop">Bishop</label>
                </span>
                <span className="radio-btn-container">
                    <input type="radio" id="promote-rook" className="radio-btn" name="promote" value="rook" />
                    <label htmlFor="promote-rook">Rook</label>
                </span> 
            </div>  
             <button className="submit-button" onClick={(event) => promote(event)}>Okay</button>             
        </form>
    </div>
  )
}

export default DialogBox
export {pawnPromotion}
