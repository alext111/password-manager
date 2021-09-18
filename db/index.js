const mongoose = require('mongoose')
const mongouri = process.env.mongouri

console.log(mongouri)

//connection to mongodb
mongoose
    .connect(mongouri, { useNewUrlParser: true})
    .catch(e => {
        console.error('Connection Error', e.message)
    })

const db = mongoose.connection

module.exports = db