const mongoose = require('mongoose')
const mongopw = "iKsMXUcFL6K6BcAI"

mongoose
    .connect(`mongodb+srv://pwmanager:${mongopw}@cluster0.thott.mongodb.net/pwDB?retryWrites=true&w=majority`, { useNewUrlParser: true})
    .catch(e => {
        console.error('Connection Error', e.message)
    })

const db = mongoose.connection

module.exports = db