import React from 'react'
import './styles/StockfishDialog.css'
import { setOpponent } from './Chessboard'

const setPlayerSide = () => {
    var playerSide = ""
    var playerBtnGrp = document.getElementById("player-btn-grp")
    for (var i=0; i<playerBtnGrp.length; i++){
        if (playerBtnGrp.elements[i].checked){
            playerSide = playerBtnGrp.elements[i].value
        }
    }
    console.log("Playing side", playerSide)
    setOpponent(playerSide==="w" ? "b" : "w", "s")
}

const StockfishDialog = () => {
  return (
    <div id="stockfish-menu-container">
        <div className="stockfish-menu">
            <h2 className="menu-title">Play with Stockfish</h2>
            <div className="choose-side">
                <h3>Choose your side</h3>
                <form id="player-btn-grp">
                    <label className="player-btn">
                        <input className="player-side-btn" type="radio" name="player-side" value="w" defaultChecked />
                        <img className="player-btn-img" src="/images/king_w.png" alt="White" />
                    </label>
                    <label className="player-btn">
                        <input className="player-side-btn" type="radio" name="player-side" value="b" />
                        <img className="player-btn-img" src="/images/king_b.png" alt="Black" />
                    </label>
                </form>
            </div>
            <button className="okay-button" onClick={(event) => setPlayerSide(event)}>Okay</button>
        </div>
    </div>
  )
}

export default StockfishDialog