require('dotenv').config({ path: './.env'})

const apiPort = process.env.PORT || 3001
const mongouri = process.env.mongouri

module.exports = {
    apiPort,
    mongouri
  }