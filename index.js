const express = require('express')
const app = express()
require('dotenv').config()
const db = require('./db')
const urlRouter = require('./routes/urls-route')
const apiPort = process.env.PORT || 3001

console.log(process.env.PORT)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.on('error', console.error.bind(console, 'MongoDB Connection Error'))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept")
    next()
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', urlRouter)

app.listen(apiPort, console.log(`Server is running on port ${apiPort}`));