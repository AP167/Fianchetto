import * as React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './styles/SignUp.styles.css'
import { signUpWithEmailPass } from '../authentication/authentication';

export default function SignUp() {
    let navigate = useNavigate();

    const signUpUser = () => {
        const email = document.getElementById("email")
        const password = document.getElementById("password")
        signUpWithEmailPass(email.value, password.value, gotoNextPage)
    }

    const gotoNextPage = (status, userId) => {
        if (status==="success"){
            navigate('/game-page', { state: { uid : userId } })
        } else {
            alert(status)
        }
    }
        return (
            <div className="sign-up-page">
                <Box className='Sign-Up'>
                <Box className='Left-Box'>
                    <Box component= 'form' 
                        sx = {{
                            '& .MuiTextField-root': { 
                                m: 1.5,
                                width: '70%',
                                left: '14%',
                                backgroundColor: 'rgba(244, 153, 26, 0.53)', 
                            },
                        }}  
                        nonValidate
                        autoComplete = 'Off'>
                            <Typography color='#321313' lineHeight='30%' align='center' fontSize='200%' fontFamily='Grenze Gotisch'>
                                <h2>Hello Friend! </h2>
                                <h4>Let's begin our chess journey!</h4>
                                <br></br>
                                <h1>SIGN UP</h1>
                            </Typography>

                            <TextField required id = 'email' label = 'Email' >
                            </TextField>
                            
                            <TextField required id = 'password' label = 'Password' type = 'password'>
                            </TextField>
                            
                            <Button sx = {{
                                m: 1.5,
                                backgroundColor: '#321313',
                                padding: '',
                                ":hover" : {
                                    bgcolor: '#321313',
                                    color: '#ffffff'
                                },
                                color: '#ffffff',
                                width: '70%',
                                height: '7%',
                                left: '14%',
                            }} 
                            onClick={signUpUser} >
                                <Typography color='#f2ead3' fontFamily='sans-serif' padding='0'>
                                    <h4>Sign Up</h4>
                                </Typography>
                            </Button>
                            <Button onClick={() => navigate('/sign-in')} sx = {{
                                m: 1.5,
                                color: '#321313',
                                left: '14%',
                                width: '70%',
                                ":hover" : {
                                    color: '#321313'
                                },
                            }}>
                                <Typography color='#321313' fontFamily='sans-serif'>
                                <h3>Or, sign in to continue our journey!</h3>
                            </Typography>
                                
                            </Button>
                            <Typography>
                                <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                            </Typography>
                    </Box>
                </Box>
                <Box className='Right-Box'>
                    <Typography color='#F2EAD3' lineHeight= '10%' align='center' fontSize='400%' fontFamily='Grenze Gotisch' >
                        <h3>Fianchetto</h3>
                        <h5>Play chess with us and be the master!</h5>
                    </Typography>
                </Box>
            </Box>
            </div>
        )
    }

