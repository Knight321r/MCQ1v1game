import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import router from './router/route.js';
import connect from './Database/connectn.js';
import { createServer } from 'http'
import { Server } from 'socket.io';
import MCQList from './Models/mcqlistmodel.js';
import MCQ from './Models/mcqmodel.js';

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

app.use(morgan('tiny')) 
app.use(cors())
app.use(express.json())

app.use('/api', router)

let lobbymcqlists = []
const gameRooms = {}

io.on('connection', (socket) => {
    console.log(`client connected with id : ${socket.id}`)
     
    socket.on('requestLobbyState', () => {
        socket.emit('lobbyUpdate', lobbymcqlists); 
    }); 
    
    socket.on('addToLobby', (item) =>{
        const updateditem = {...item, addedBy : socket.id}
        lobbymcqlists.push(updateditem);
        io.emit('lobbyUpdate', lobbymcqlists)
    })
     
    socket.on('removeFromLobby', (itemid) => {  
        lobbymcqlists = lobbymcqlists.filter((lobbyitem) => lobbyitem._id !== itemid)
        io.emit('lobbyUpdate', lobbymcqlists)
    })

    socket.on('joinGame', async (itemid, username) => {
        //console.log("username :", username) 
        try{ 
            if(!gameRooms[itemid]){
                const mcqlist = await MCQList.findById(itemid)
                const mcq = await MCQ.find({list : itemid})

                gameRooms[itemid] = {
                    players : [{id : socket.id, username: username, score : 0, currentQuestion : 0}],
                    questions : mcq,
                    status : 'waiting',
                }
                socket.join(itemid)
                io.to(itemid).emit('gameUpdate', gameRooms[itemid])
            }
            else if(gameRooms[itemid].players.length === 1 && gameRooms[itemid].status === 'waiting'){
                gameRooms[itemid].players.push({id : socket.id, username: username, score : 0, currentQuestion : 0})
                socket.join(itemid);
                gameRooms[itemid].status = 'playing'
                startGame(itemid);
            }
            else{
                const msg = "try to re-enter the game"
                io.to(itemid).emit('gameError', msg)
                console.log('cannot join')
            }
        }
        catch(error){ 
            //alert('error catched, go back to main page')
            const msg = "try to re-enter the game"
            io.to(itemid).emit('gameError', msg)
            console.error('error joining game', error)
        }
    })

 
    socket.on('submitAnswer', (itemId, answerIndex) => {
        if (gameRooms[itemId] && gameRooms[itemId].status === 'playing') {
            const player = gameRooms[itemId].players.find(p => p.id === socket.id);
            if (player) {
                const currentQuestion = player.currentQuestion;
                const Question = gameRooms[itemId].questions[currentQuestion];
                if (Question.correctAnswer.includes(answerIndex + 1)) {
                    player.score++;
                } 
                nextQuestion(itemId, socket);
            }
        }
    });
 
    socket.on('disconnect', () => {
        console.log('client disconnected') 
    })
})

function startGame(itemid){
    io.to(itemid).emit('gameUpdate', gameRooms[itemid]);
    io.to(itemid).emit('nextQuestion', gameRooms[itemid].questions[0]);
}

function nextQuestion(itemId, socket) {
    const player = gameRooms[itemId].players.find(p => p.id === socket.id)
    const currentQuestion = player.currentQuestion + 1;
    player.currentQuestion++;
    if (currentQuestion < gameRooms[itemId].questions.length) {
        socket.emit('nextQuestion', gameRooms[itemId].questions[currentQuestion]);
    } else {
        endGame(itemId, socket); 
    } 
}

function endGame(itemId, socket) { 
    const len = gameRooms[itemId].questions.length 
    // console.log("len:", len)
    const player = gameRooms[itemId].players.find(p => p.currentQuestion !== len) 
    // if(player) console.log("p.currentQuestion :", player.currentQuestion)
    if(player){
        // alert('opponent is still playing , plz wait')
        const scores = [];  
        socket.emit('gameEnded', {scores})
    }
    else{
        const room = gameRooms[itemId];   
        room.status = 'finished'; 
        let result;  
        const scores = [];
        // console.log('one username :', room.players[0].username) 
        if (room.players[0].score > room.players[1].score) {
            result = `${room.players[0].username} wins!`;
        } else if (room.players[1].score > room.players[0].score) { 
            result = `${room.players[1].username} wins!`;
        } else {
            result = "It's a draw!";
        }
        socket.emit('gameEnded', {scores})
        io.to(itemId).emit('gameEnded', { result, scores: room.players.map(p => ({ username: p.username, score: p.score })) });
        delete gameRooms[itemId];
    }
}


connect().then(() => { 
    try{
        httpServer.listen(8080, () => {
            console.log("app is working");
        }) 
    }
    catch(error){ 
        console.log("app is not working", error)
    }
}).catch((err) => {
    console.log("Cannot connect to database", err); 
})