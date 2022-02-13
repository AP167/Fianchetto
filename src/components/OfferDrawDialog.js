import React from 'react'
import './styles/OfferDrawDialog.css'
import { showResult } from './ResultDialog'
import { getGameId, multiPlayerMove } from './Chessboard'
import { getMyUsername } from '../App'

const acceptDraw = (event) => {
    event.preventDefault()
    showResult("Draw by mutual agreement", "d")
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch(`https://taytay.pythonanywhere.com/make-move?game_id=${getGameId()}&player=${getMyUsername()}&move=accept`, requestOptions)
    .catch(error => console.log('error', error));
    // showResult("Draw by mutual agreement", "d")
    document.getElementById("offer-menu").style.visibility="hidden"
    document.getElementById("offer-menu").style.zIndex="-4"
}

const rejectDraw = (event) => {
    event.preventDefault()
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    fetch(`https://taytay.pythonanywhere.com/make-move?game_id=${getGameId()}&player=${getMyUsername()}&move=reject`, requestOptions)
    .catch(error => console.log('error', error));
    // showResult("Draw by mutual agreement", "d")
    
    setTimeout(() => {
    fetch(`https://taytay.pythonanywhere.com/get-opponent-move?game_id=${getGameId()}&player=${getMyUsername()}`, requestOptions)
        .then(response => response.text())
        .then(result => multiPlayerMove(result))
        .catch(error => multiPlayerMove(error));
    }, 100)

    document.getElementById("offer-menu").style.visibility="hidden"
    document.getElementById("offer-menu").style.zIndex="-4"
}


const OfferDrawDialog = () => {
  return (
    <div id="offer-menu">
        <div className="offer-container">
            <h1 className="app-name">Opponent has offered Draw</h1>
            <div className="play-btn-grp">
                <button className="play-btn" onClick={(event) => acceptDraw(event)}>Accept Draw</button>
                <button className="play-btn" onClick={(event) => rejectDraw(event)}>Reject Draw</button>
                
            </div>
        </div>
    </div>
  )
}

export default OfferDrawDialog