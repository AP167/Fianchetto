import React from 'react'
import './styles/HomePage.css'
import { useNavigate } from 'react-router-dom'


export default function HomePage() {

  let navigate = useNavigate() 

  return (
    <div id="home-page">
        <div className="app-title">
            <img src="./fianchetto_vector.svg" alt="Logo" id="app-logo" />
            <div id="app-name"><h1>Fianchetto</h1></div>
        </div>
        <div className="nav-btn-grp">
            <button className="nav-btn" 
                onClick={() => navigate('/sign-in')}>
                    Sign In / Sign Up
            </button>
            <button className="nav-btn" 
                onClick={() => navigate('/game-page', { state: { uid : "Anon" } })}>
                    Play Anonymous
            </button>
        </div>
    </div>
  )
}
