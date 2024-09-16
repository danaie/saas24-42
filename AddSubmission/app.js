const express = require('express')
const inputCheck = require('./middlewares/input_check')
const sendMessage = require('./middlewares/send_msg')
const createID = require('./middlewares/createID')
const app = express()

app.use(express.json())
// app.use(express.urlencoded())

app.post('/', [inputCheck, createID, sendMessage], (req, res) => {
    
    res.status(200).send('Ok')
})

app.listen(3000, () => console.log(`NewSubmission is listening on port ${3000}!`))