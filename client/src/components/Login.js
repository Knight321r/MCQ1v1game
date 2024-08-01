import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setusername, setpassword, setemail } from './reducer';
import { Navigate, useNavigate } from 'react-router-dom';
import Lobby from './Lobby';
import Signup from './Signup';
import axios from 'axios';

function Login() {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const handlelogin = async(e) => {
        e.preventDefault();

        if (!user.username || !user.password) {
            alert('All fields are required');
            setError('All fields are required');
        }

        try{
            const response = await axios.post('http://localhost:8080/api/login/', {
                username: user.username,
                password: user.password,
            })

            localStorage.setItem('token', response.data.token)
            // console.log("token here:", response.data.token)
            // console.log("logged in user")
            navigate('/Lobby')
        }
        catch(error){
            console.error("Login failed:", error);
            if(error.response){
                if (error.response.status === 401) {
                    alert('Invalid username or password');
                } else {
                    alert('An error occurred during login');
                }
            }
            else if(error.request){
                alert('No response from server. Please try again.');
            }
            else{
                alert('An error occurred during login');
            }
        }
    }
    const handlesignup = (e) => {
        dispatch(setusername(""))
        dispatch(setpassword(""))
        navigate('/Signup')
    }

  return (
    <div className='login'>
        <h1>Welcome to login page</h1>
        <label>Username :</label>
        <input type='text' placeholder='Enter Username' value = {user.username} onChange={(e) => dispatch(setusername(e.target.value))}></input>
        <br></br>
        <label>Password :</label>
        <input type='password' placeholder='Enter Password' value = {user.password} onChange={(e) => dispatch(setpassword(e.target.value))}></input>
        <br></br>
        <button onClick={handlelogin}>Login</button>
        <br></br>
        <button onClick={handlesignup}>Click here if you are new(Register)</button>
    </div>
  )
}

export default Login
