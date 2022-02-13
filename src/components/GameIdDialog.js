import React from 'react'
import './styles/GameIdDialog.css'

const closeGameIdDialog = () => {
    document.getElementById("gameid-menu-container").style.visibility="hidden"
    document.getElementById("gameid-menu-container").style.zIndex="-4"
}

const copyGameId = () => {
    var copyText = document.getElementById("copy-game-id");
    console.log(copyText.value)
  
    copyText.select();
  
    navigator.clipboard.writeText(copyText.value);

    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied!"
} 

const outsideCopy = () => {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
}

const GameIdDialog = () => {
  return (
    <div id="gameid-menu-container">
        <div className="gameid-menu">
            <h2 className="menu-title">Play with a friend</h2>
            <h3>Copy the game id and send it to your friend</h3>
            <div className="gameid-copy">
                <input type="text" id="copy-game-id" disabled />
                <div class="tooltip">
                    <button className="copy-btn" 
                    onClick={copyGameId}
                    onMouseOut={outsideCopy}>
                        <span class="tooltiptext" id="myTooltip">Copy to clipboard</span>
                        📋
                    </button>
                </div>            
            </div> 
            <button 
            className="okay-button" 
            onClick={closeGameIdDialog}>
                Start Game
            </button>
        </div>
    </div>
  )
}

export default GameIdDialog