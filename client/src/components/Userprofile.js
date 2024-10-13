import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import socket from './socket';
import Login from './Login';
import './Signup.css'

function Userprofile() {
    const [mcqlist, setmcqlist] = useState([])
    const [lobbyitems, setlobbyitems] = useState([])
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    useEffect(() => {
      fetchmcqlist();
    }, []);

    useEffect(() => {
      socket.emit('requestLobbyState')

      socket.on('lobbyUpdate', (updatedlobby) => {
        setlobbyitems(updatedlobby)
        // console.log("after set the lobby items :", lobbyitems)
      })
      
      return () => {
        socket.off('lobbyUpdate')
      }
    }, [])

    const fetchmcqlist = async () => {
      try{
        const response = await axios.get('http://localhost:8080/api/mcqlists', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setmcqlist(response.data)
      }
      catch(error){
        alert('login expired, re-login')
        navigate('/')
        console.error('error in fetchmcqlist', error);
      }
    }

    const handleaddmcq = async () => {
      const name = prompt('Enter MCQ List name:');
      const description = prompt('Enter MCQ List description:');
      if(name && description){
        try{
          const response = await axios.post('http://localhost:8080/api/mcqlists', {name, description}, {
            headers : {
              Authorization : `Bearer ${token}`
            }
          })
          setmcqlist([...mcqlist, response.data]);
        }
        catch(error){
          console.error('error in handleaddmcqlist', error);
        }
      }
    }

    const handledeletemcq = async (id) => {
      try{
        await axios.delete(`http://localhost:8080/api/mcqlists/${id}`,{
          headers : {
            Authorization : `Bearer ${token}`,
          }
        })
        setmcqlist(mcqlist.filter(list => list._id !== id))
      }
      catch(error){
        console.error('error in handledeletemcqlist', error)
      }
    }

    const handletogglelobby = (item) => {
      const inlobby = lobbyitems.some(lobbyitem => lobbyitem._id === item._id)
      if(inlobby){
        socket.emit('removeFromLobby', item._id)
      }
      else{
        socket.emit('addToLobby', item)
      }
      // console.log("after update:", lobbyitems)
    }

    return (
      <div className='Userprofile'>
        <h1>Userprofile component</h1>
        <button onClick={handleaddmcq}>Add Mcqlist</button>
        {mcqlist.map((item, ind) => {
          const inlobby = lobbyitems.some(lobbyitem => lobbyitem._id === item._id)
          // console.log("lobbyitems:", lobbyitems)
          return(
          <div key={item._id}>
            <p>mcq no.{ind + 1}</p>
            <p>{item.name}</p>
            <p>{item.description}</p>
            <button onClick={() => navigate(`../Mcqlist/${item._id}`)}>View MCQ List</button>
            <button onClick={() => handledeletemcq(item._id)}>Delete the above MCQ</button>
            <button onClick={() => handletogglelobby(item)}>{inlobby ? "Remove from lobby" : "Add to lobby"}</button>
          </div>)
        })}
      </div>
    )
}

export default Userprofile