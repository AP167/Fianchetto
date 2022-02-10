import React from 'react'
import { setOpponent } from './Chessboard'
import './styles/PlayMenu.css'

const play1 = (event) => {
    event.preventDefault()
    document.getElementById("play-menu").style.visibility="hidden"
    document.getElementById("play-menu").style.zIndex="-5"
    document.getElementById("stockfish-menu-container").style.visibility="visible"
    document.getElementById("stockfish-menu-container").style.zIndex="4"
}

const play2 = (event) => {
    event.preventDefault()
    setOpponent("", "m")
}

const play3 = (event) => {
    event.preventDefault()
    setOpponent("", "y")
}

const PlayMenu = () => {
  return (
    <div id="play-menu">
        <div className="menu-container">
            <h1 className="app-name">~ Fianchetto ~</h1>
            <div className="play-btn-grp">
                <button className="play-btn" onClick={(event) => play1(event)}>Play with Stockfish</button>
                <button className="play-btn" onClick={(event) => play2(event)}>Play with a friend</button>
                <button className="play-btn" onClick={(event) => play3(event)}>Play with Yourself (Test)</button>
            </div>
        </div>
    </div>
  )
}

export default PlayMenu
