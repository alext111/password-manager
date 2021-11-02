const app = require('./app')
const config = require('./utils/config')

app.listen(config.apiPort, console.log(`Server is running on port ${config.apiPort}`));