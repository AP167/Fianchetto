import React from 'react'
import './styles/MultiplayerDialog.css'
import { TextField } from '@mui/material'
import { createGame, joinAsOpponent } from './Challenge'
import { getMyUsername } from '../App'
import { getUserData } from '../db/db'


const createNewGame = (event) => {
    event.preventDefault()
    var userId = getMyUsername()
    var oppId = document.getElementById("opp-id").value
    getUserData(oppId)
    .then((result) => {
        if (result===null)
            alert("User doesn't exist")
        else
            createGame(userId, oppId )
    })
    // createGame(userId, oppId )
    // setOpponent("", "m")
}

const joinGame = (event) => {
    event.preventDefault()
    var userId = getMyUsername()
    var oppId = "Opponent"
    var gameId = document.getElementById("game-id").value
    joinAsOpponent(userId, oppId, gameId)
}


const MultiplayerDialog = () => {
  return (
    <div id="multiplayer-menu-container">
        <div className="multiplayer-menu">
            <h2 className="menu-title">Play with a friend</h2>
            <div className="challenge">
                <TextField id = 'opp-id' label = {`Opponent's Username`}
                        sx={{
                            input: {
                                color: 'rgb(65, 44, 21)', 
                                backgroundColor: '#f3c590',
                                width: '25vw',
                            }
                        }} /> 
                <button 
                className="multiplayer-btn" 
                onClick={(event) => createNewGame(event)}>
                    Create a game
                </button>
            </div>
            <div className="challenge" id="join-game">
                <TextField id = 'game-id' label = 'Game ID'
                        sx={{
                            input: {
                                color: 'rgb(65, 44, 21)', 
                                backgroundColor: '#f3c590',
                                width: '25vw',
                            }
                        }}
                        autoComplete='Off' /> 
                <button 
                className="multiplayer-btn"
                onClick={(event) => joinGame(event)}>
                    Join a Game
                </button>
            </div>
        </div>
    </div>
  )
}

export default MultiplayerDialog


{/* <TextField required id = 'user-id' label = 'user-id' ></TextField> */}