import React from 'react'
import { refreshBoard } from './Chessboard'
import './styles/ResultDialog.css'

var gameOverAudio = new Audio('/assets/sound/GameOver.mp3')

var gameEnded = false
var result = ""

const hasGameEnded = () => gameEnded

const resetGameEnded = () => {
    gameEnded = false
    result = ""
}

const getResult = () => result



const showResult = (newGameStatus, newWinner) => {
    document.getElementById("result-container").style.visibility="visible"
    document.getElementById("result-container").style.zIndex="3"

    gameEnded = true

    var win = "Draw"
    if (newWinner==="w") 
        win = "White has won!"
    else if (newWinner==="b")
        win = "Black has won!"

    if (newGameStatus!=="Stalemate" && newWinner==="d")
        setTimeout(() => {gameOverAudio.play()}, 200)

    result = newGameStatus + " : " + win

    ResultDialog.setResult(newGameStatus, win)
}


const closeDialog = () => {
    document.getElementById("result-container").style.visibility="hidden"
    document.getElementById("result-container").style.zIndex="-3"
    refreshBoard()
}


const ResultDialog = () => {
    const [gameStatus, setGameStatus] = React.useState("game status")
    const [winner, setWinner] = React.useState("xyz has won")

    const setResult = (newGameStatus, newWinner) => {
        setGameStatus(newGameStatus)
        setWinner(newWinner)
    }

    ResultDialog.setResult = setResult

    return (
        <div id="result-container">
            <div className="result-dialog">
                <h2 className="game-status">{gameStatus}</h2>
                <div className="winner-container">
                    <h3 className="winner-text">{winner}</h3>
                </div>
                <button className="okay-button" onClick={(event) => closeDialog(event)}>Okay</button>
            </div>
        </div>
      )
}

export default ResultDialog
export {showResult, getResult, resetGameEnded, hasGameEnded}
