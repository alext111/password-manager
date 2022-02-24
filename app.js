const express = require('express')
const app = express()
const db = require('./db')
const urlRouter = require('./routes/urls-route')
const path = require('path')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('build'))

db.on('error', console.error.bind(console, 'MongoDB Connection Error'))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept")
    next()
})

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './client/build')))

app.use('/api', urlRouter)

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
  })

module.exports = app