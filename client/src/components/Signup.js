import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setusername, setpassword, setemail } from './reducer';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
function Signup() {


  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // useEffect(()=>{
  //   console.log(error);
  // })

  // console.log("username:" + user.username)
  // console.log("password:" + user.password)
  // console.log("email:" + user.email)

  const token = localStorage.getItem("token");
  // console.log("token:", token)

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handlesignup = async (e) => {
    // fetch()
    e.preventDefault();

    if (!user.username || !user.email || !user.password) {
      alert('All fields are required');
      setError('All fields are required');
    }

    // Validate email
    if (!validateEmail(user.email)) {
      alert('Please enter a valid email address');
      setError('Please enter a valid email address');
    }

    try {
      const response = await axios.post('http://localhost:8080/api/signup/', {
        username: user.username,
        email: user.email,
        password: user.password,
      });

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);
      // console.log(response.data.token)
      // console.log("user:" + response.data.user)

      // Navigate to the lobby
      navigate('/lobby');
    } catch (error) {
      console.error('Signup failed:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400) {
          // This is likely a "user already exists" error
          setError(error.response.data.message || 'Username or email already exists');
          // console.log("error is:", error)
        } else {
          setError('An error occurred during signup111');
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred during signup222');
      }

      alert(error)
    }





  }

  return (
    <div className='Signup'>
      <label>Username :</label>
      <input type='text' placeholder='Enter Username' value = {user.username} onChange={(e) => dispatch(setusername(e.target.value))}></input>
      <br></br>
      <label>Email :</label>
      <input type='email' placeholder='Enter Email' value = {user.email} onChange={(e) => dispatch(setemail(e.target.value))}></input>
      <br></br>
      <label>Password :</label>
      <input type='password' placeholder='Enter Password' value = {user.password} onChange={(e) => dispatch(setpassword(e.target.value))}></input>
      <br></br>
      <button onClick={handlesignup}>Signup</button>
    </div>
  )
}

export default Signup




