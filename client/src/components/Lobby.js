import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import socket from './socket';
import { useNavigate } from 'react-router-dom';

function Lobby() {

  const [username, setusername] = useState('')
  const [mcqlist, setmcqlist] = useState([])
  const token = localStorage.getItem('token')
  const navigate = useNavigate();

  useEffect(()=>{
    if (token) {
      const decodedToken = jwtDecode(token);
      setusername(decodedToken.username);
    }

  }, [token])

  useEffect(() => {
    socket.emit('requestLobbyState')

    socket.on('lobbyUpdate', (updatedlobby) => {
      setmcqlist(updatedlobby)
    })

    return () => {
      socket.off('lobbyUpdate')
    }
  }, [])

  const startgame = (itemid) => {
    navigate(`/game/${itemid}`)
  }
  // console.log(mcqlist)
  return (
    <div className='lobby'>
      <h1>Welcome to the lobby {username}</h1>
      <h3>Here are all the active games</h3>
      {mcqlist.map((item => {

        return (
          <div key = {item._id}>
            <h3>Name = {item.name}</h3>
            <h3>Description = {item.description}</h3>
            <button onClick={() => startgame(item._id)}>Click to enter into the game</button>
          </div>
        )
      }))}
    </div>
  )
}

export default Lobby
