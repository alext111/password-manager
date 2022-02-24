const express = require('express')
const app = express()
const db = require('./db')
const urlRouter = require('./routes/urls-route')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('build'))

db.on('error', console.error.bind(console, 'MongoDB Connection Error'))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept")
    next()
})

app.use('/api', urlRouter)

module.exports = app