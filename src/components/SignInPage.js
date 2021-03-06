import React from 'react'
import { TextField } from '@mui/material'
import './styles/SignInPage.css'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailPass, signUpWithEmailPass } from '../authentication/authentication'
import { getUserData, writeUserData } from '../db/db'

const SignInPage = (props) => {

    let navigate = useNavigate()

    console.log(props.sign)

    const signInUser = (event) => {
        event.preventDefault()
        const email = document.getElementById("email")
        const password = document.getElementById("password")

        if (props.sign==="In")
            signInWithEmailPass(email.value, password.value, gotoNextPage)
        else{
            const username = document.getElementById("username")
            console.log(username.value)
            getUserData(username.value)
            .then((userdata) => {
                console.log(userdata)
                if (userdata===null){
                    signUpWithEmailPass(email.value, password.value, username.value, gotoNextPage)
                }
                else
                    alert("Username already taken")
                })
            // writeUserData(email.value, username.value)
            
        }
    }

    const gotoNextPage = (status, userId) => {
        if (status==="success"){
            console.log("userId before navigate : ", userId)
            navigate('/game-page', { state: { uid : userId } })
        } else {
            alert(status)
        }
    }
    
    return (
        <div className="sign-in-page" id="sign-in-page">
            <form id="sign-in-container">
                <h2 className="form-title">Sign {props.sign}</h2>
                <div className="textfield-container">
                    <TextField required id = 'email' label = 'Email'
                        sx={{
                            input: {
                                color: 'rgb(65, 44, 21)', 
                                backgroundColor: '#f3c590',
                                width: '25vw',
                            }
                        }} />
                </div>
                {props.sign==="Up" ? <div className="textfield-container">
                <TextField required id = 'username' label = 'Username'
                        sx={{
                            input: {
                                color: 'rgb(65, 44, 21)', 
                                backgroundColor: '#f3c590',
                                width: '25vw',
                            }
                        }} /> 
                </div> : <></>
                }
                <div className="textfield-container">
                    <TextField required id = 'password' label = 'Password' type='password'
                        sx={{
                            input: {
                                color: 'rgb(65, 44, 21)', 
                                backgroundColor: '#f3c590',
                                width: '25vw',
                            }
                        }} />
                </div>
                <button className="sign-in-btn" onClick={(event) => signInUser(event)} >
                    Sign {props.sign}
                </button>
                <h3 className="sign-up-option">
                    {props.sign==="In" ? "Don't" : "Already"} have an account? 
                    <span onClick={() => navigate(`/sign-${props.sign==="In" ? "up" : "in"}`)}> Sign {props.sign==="In" ? "up" : "in"}</span> here
                </h3>
            </form>
            <div className="sign-app-title">
                <img src="./fianchetto_vector.svg" alt="Logo" className="sign-app-logo" />
                <div className="sign-app-name"><h1>Fianchetto</h1></div>
            </div>
        </div>
    )
}

export default SignInPage