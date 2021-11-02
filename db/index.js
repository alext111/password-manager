const mongoose = require('mongoose')
const config = require('../utils/config')

//connection to mongodb
mongoose
    .connect(config.mongouri, { useNewUrlParser: true})
    .catch(e => {
        console.error('Connection Error', e.message)
    })

const db = mongoose.connection

module.exports = db