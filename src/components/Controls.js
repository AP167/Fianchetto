import React from 'react'
import './Controls.css'


var soundOn = true
var highlightOn = true

const getSoundOn = () => soundOn
var getHighlightOn = () => highlightOn

const toggleSound = () => {
    soundOn = !soundOn
}

const toggleHighlight = () => {
    highlightOn = !highlightOn
}

const Controls = () => {
  return (
      <>
        <div className="toggle-btn-grp">
            <div className="toggle-btn">
                <label className="switch">
                    <input type="checkbox" id="highlight-switch" onChange={toggleHighlight} />
                    <span className="slider round"></span>
                </label>
                <span>Highlight Moves</span>
            </div>
            <div className="toggle-btn">
                <label className="switch">
                    <input type="checkbox" id="sound-switch" onChange={toggleSound} />
                    <span className="slider round"></span>
                </label>
                <span>Sound</span>
            </div>
        </div>
      </>
  )
}

export default Controls
export { getSoundOn, getHighlightOn }
