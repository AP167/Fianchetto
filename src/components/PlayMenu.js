import React from 'react'
import { setOpponent } from './Chessboard'
import './styles/PlayMenu.css'
import { createGame, joinAsOpponent } from './Challenge'
import { TextField } from '@mui/material'

const play1 = (event) => {
    event.preventDefault()
    document.getElementById("play-menu").style.visibility="hidden"
    document.getElementById("play-menu").style.zIndex="-5"
    document.getElementById("stockfish-menu-container").style.visibility="visible"
    document.getElementById("stockfish-menu-container").style.zIndex="4"
}

const play2 = (event) => {
    event.preventDefault()
    var userId = document.getElementById("user-id").value
    var oppId = document.getElementById("opp-id").value
    createGame(userId, oppId )
    // setOpponent("", "m")
}

const play3 = (event) => {
    event.preventDefault()
    setOpponent("", "y", "", "")
}

const play4 = (event) => {
    event.preventDefault()
    var userId = document.getElementById("user-id").value
    var oppId = document.getElementById("opp-id").value
    var gameId = document.getElementById("game-id").value
    joinAsOpponent(userId, oppId, gameId)
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
                <button className="play-btn" onClick={(event) => play4(event)}>I accept the challenge</button>
                <TextField required id = 'game-id' label = 'game-id' ></TextField>
                <TextField required id = 'user-id' label = 'user-id' ></TextField>
                <TextField required id = 'opp-id' label = 'opp-id' ></TextField>
            </div>
        </div>
    </div>
  )
}

export default PlayMenu
