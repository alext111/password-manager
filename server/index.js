const express = require('express')
const app = express()
const db = require('./db')
const urlRouter = require('./routes/urls-route')
const config = require('./utils/config')

console.log(config.apiPort)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('build'))

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

app.listen(config.apiPort, console.log(`Server is running on port ${config.apiPort}`));