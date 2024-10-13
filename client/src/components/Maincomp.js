import React from 'react'
import Navbar from './Navbar'
import { EnterLobbyButton, EnterLoginButton } from '../App'
import Lobby from './Lobby'
import Login from './Login'
import './Maincomponent.css'

function Maincomp() {
  return (
    <div>
        <Navbar /> 
        <h1>Welcome to MCQ App</h1>
        <EnterLobbyButton />
        <EnterLoginButton />
    </div>
  )
}

export default Maincomp
