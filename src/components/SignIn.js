import * as React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './styles/SignIn.styles.css';
import { signInWithEmailPass } from '../authentication/authentication';


export default function SignIn() {
        let navigate = useNavigate();

        const signInUser = () => {
            const email = document.getElementById("email")
            const password = document.getElementById("password")
            signInWithEmailPass(email.value, password.value, gotoNextPage)
        }

        const gotoNextPage = (status, userId) => {
            if (status==="success"){
                console.log("userId before navigate : ", userId)
                navigate('/gamePage', { state: { uid : userId } })
            } else {
                alert(status)
            }
        }


        return (
            <Box className='Sign-In'>
                <Box className='Right-Box-signIn'>
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
                                <h4>Let's continue our chess journey!</h4>
                                <br></br>
                                <h1>SIGN IN</h1>
                            </Typography>

                            <TextField required id = 'email' label = 'Email' >
                            </TextField>
                            
                            <TextField required id = 'password' label = 'Password' type = 'password' >
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
                            onClick={signInUser}>
                                <Typography color='#f2ead3' fontFamily='sans-serif' padding='0'>
                                    <h4>Sign In</h4>
                                </Typography>
                            </Button>
                            <Button onClick={() => navigate('/signUp')}  sx = {{
                                m: 1.5,
                                color: '#321313',
                                left: '14%',
                                width: '70%',
                                ":hover" : {
                                    color: '#321313'
                                },
                            }}>
                                <Typography color='#321313' fontFamily='sans-serif'>
                                <h3>Or, sign up to begin our journey!</h3>
                            </Typography>
                                
                            </Button>
                            <Typography>
                                <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                            </Typography>
                    </Box>
                </Box>
                <Box className='Left-Box-signIn'>
                    <Typography color='#F2EAD3' lineHeight= '10%' align='center' fontSize='400%' fontFamily='Grenze Gotisch' >
                        <h3>Fianchetto</h3>
                        <h5>Play chess with us and be the master!</h5>
                    </Typography>
                </Box>
            </Box>
        )
    }

