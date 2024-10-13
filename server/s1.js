// const express = require('express')
import express from 'express'
import cors from 'cors'
import router from './duproute.js'
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', router)


app.get('/', (req, res) => {
    res.status(200).json({message : 'connected'})
})

app.get('/hello/:id', (req, res) => {
    const {id} = req.params;
    console.log(req.params)
    console.log(id)
    res.status(200).json({message : id})
})

app.post('/hello/:id', (req, res) => {
    const {userid, pass} = req.body;
    console.log(userid, pass)
    res.status(200).json({message : "sent"})
})

// app.get('/api/:id', (req, res) => {
//     const {id} = req.params
//     res.send("asasfafas" + id)
// })

app.listen(8080, () => {
    console.log("app is running")
})