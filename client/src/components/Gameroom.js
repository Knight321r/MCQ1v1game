import React, { useEffect } from 'react'
import socket from './socket'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useSelector } from 'react-redux';

function Gameroom() {

    const user = useSelector((state) => state.user)
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState('waiting');
    const [opponent, setOpponent] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    // useEffect(()=>{
    //     if (token) {
    //       const decodedToken = jwtDecode(token); 
    //       console.log("before setting state:", decodedToken.username)
    //       setusername(decodedToken.username);
    //     }
    
    //   }, [])

    useEffect(() => {
        // if (token) {
        //     const decodedToken = jwtDecode(token); 
        //     console.log("before setting state:", decodedToken.username)
        //     setusername(decodedToken.username);
        // }
        console.log('username :', user.username)
        socket.emit('joinGame', id, user.username)

        socket.on('gameUpdate', (gameState) => {
            console.log('Game update received:', gameState);
            if (gameState.status === 'playing') {
                setGameStatus('playing');
                setQuestions(gameState.questions);
                setCurrentQuestion(gameState.questions[0]);
                setOpponent(gameState.players.find(p => p.id !== socket.id));
            }
        });

        socket.on('nextQuestion', (question) => {
            setCurrentQuestion(question);
            setCurrentIndex(prev => prev + 1);
        });

        socket.on('gameEnded', (data) => {
            // alert(result.result);
            navigate('/results');
        });

        socket.on('gameError', (data) => {
            // if(data.scores.length !== 0){
            //     console.log('gameError lo unna data :', data)
            //     socket.emit('gameResults', data)
            // }
            // alert(data)
            navigate('/')
        })

        return () => {
            socket.off('gameUpdate');
            socket.off('nextQuestion');
            socket.off('gameEnded');
            socket.off('gameError')
        };

    }, [id. navigate, user.username])    

    const handleAnswer = (answerIndex) => {
        socket.emit('submitAnswer', id, answerIndex);
        if (currentQuestion && currentQuestion.correctAnswer.includes(answerIndex + 1)) {
            setScore(prev => prev + 1);
        }
    };

    if (gameStatus === 'waiting') {
        return <div>Waiting for opponent...</div>;
    }

    if (!currentQuestion) {
        return <div>Loading...</div>;
    }

  return (
    <div className='gameroom'>
      <h1>Gameroom</h1>
      <h2>Question {currentIndex} of {questions.length}</h2>
        <p>{currentQuestion.question}</p>
        {currentQuestion.options.map((option, index) => (
            <button key={index} onClick={() => handleAnswer(index)}>
                {option}
            </button>
        ))}
        <p>Your Score: {score}</p>
    </div>
  )
}

export default Gameroom
