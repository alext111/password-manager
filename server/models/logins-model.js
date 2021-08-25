const mongoose = require('mongoose')
const Schema = mongoose.Schema

//schema for information needed for website login
const LoginInfo = new Schema(
    {
        website: { type: String, required: true },
        pw: { type: String, required: true},
        iv: { type: String, required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('logins', LoginInfo)