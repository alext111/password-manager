/**
 * Express Server Entry Point
 * ---------------------------------------------------------
 * This file initializes and starts the backend server
 * for the Password Manager demonstration application
 *
 * Responsibilities:
 * - Connect to MongoDB
 * - Configure Express middleware
 * - Define API and static routes
 * - Enable CORS for API requests
 * - Mount route controllers
 * - Start listening on configured port
 *
 * Notes:
 * - Static files served from 'build' directory (frontend)
 */

const express = require('express')
const app = express()

// Database connection
const db = require('./db')

// API routes
const urlRouter = require('./routes/urls-route')

// Application configuration
const config = require('./utils/config')

/**
 * Middleware Setup
 */

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));


// Parse JSON request bodies
app.use(express.json());

// Serve static files from client build
app.use(express.static('build'))

// Handle MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB Connection Error'))

/**
 * Enable CORS for all routes
 * ---------------------------------------------------------
 * This allows cross-origin requests from the frontend
 * or other clients during development.
 */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // For production, restrict to frontend domain only
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept")
    next()
})

/**
 * Test / Root Route
 *
 * Returns a simple response to verify the server is running.
 */
app.get('/', (req, res) => {
    res.send('Hello World!')
})

/**
 * Mount API routes
 *
 * All routes in 'urls-route.js' are prefixed with '/api'.
 */
app.use('/api', urlRouter)

/**
 * Start Server
 *
 * Listens on the configured port from config.js
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.apiPort, () => {
    console.log(`Server is running on port ${config.apiPort}`)
  })
}

module.exports = app