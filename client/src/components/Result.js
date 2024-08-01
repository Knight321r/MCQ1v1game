import React, { useEffect, useState } from 'react'
import socket from './socket'
import { useNavigate } from 'react-router-dom'

function Result() {
    const [scores, setScores] = useState([])
    const [result, setResult] = useState("")
    const navigate = useNavigate();
    useEffect(() => {
        socket.on('gameEnded', (data) => {
            console.log('gameError lo unna data :', data)
            setScores(data.scores)
            setResult(data.result)
        })
    }, [])


    const handlebutton = () => {
        navigate('/')
    }

    if(result === ""){
        return <div>Plz wait , opponent is still playing ...</div>;
    }
  return (
    <div className='result'>
      <h1>Result</h1>
      {scores.map((item, ind) => (
        <div key = {ind}>
            <p>Username is {item.username} , Score : {item.score}</p>
        </div>
      ))}
      <h3>result is kanapadatle, ledante ikkada vastadi choodu -> {result}</h3>
      <button onClick={handlebutton}>Go back to home</button>
    </div>
  )
}
 
export default Result
