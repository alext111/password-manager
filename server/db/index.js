/**
 * Database Configuration Module
 * ---------------------------------------------------------
 * This module initializes and exports the MongoDB connection
 * using Mongoose.
 *
 * Responsibilities:
 * - Establish connection to MongoDB using a configured URI
 * - Handle connection errors
 * - Export the active Mongoose connection instance
 *
 * Environment Requirements:
 * - A valid MongoDB connection string must be provided
 *   via the configuration utility (config.mongouri)
 */

const mongoose = require('mongoose')
const config = require('../utils/config')

/**
 * Initialize MongoDB connection
 *
 * Uses Mongoose to connect to the database specified
 * in the application configuration
 *
 * Options:
 * - useNewUrlParser: Enables the new MongoDB connection string parser
 */
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.mongouri)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error', err))
}

/*
mongoose
    .connect(config.mongouri, { useNewUrlParser: true})
    .catch(e => {
        console.error('Connection Error', e.message)
    })
*/
    
/**
 * Mongoose connection instance
 *
 * This exported object can be used throughout the
 * application to listen for connection events or
 * verify database state
 */
const db = mongoose.connection

module.exports = db