/**
 * Application Configuration Module
 * ---------------------------------------------------------
 * This module centralizes environment-based configuration
 * values used throughout the backend application.
 *
 * Responsibilities:
 * - Load environment variables from a .env file
 * - Expose configuration values in a structured manner
 * - Provide default fallbacks where appropriate
 *
 * Environment Variables:
 * - PORT       → Port the Express server listens on
 * - mongouri   → MongoDB connection string
 *
 * NOTE:
 * In development, environment variables are loaded from
 * a local .env file.
 *
 * In production, these values should be injected by the
 * hosting environment (container, cloud provider, etc.)
 * rather than stored in a file.
 */

require('dotenv').config({ path: '../.env'})

/**
 * API Port
 *
 * Uses environment variable PORT if provided.
 * Falls back to 3001 for local development.
 */
const apiPort = process.env.PORT || 3001

/**
 * MongoDB Connection URI
 *
 * Must be provided via environment variable.
 * Required for successful database connection.
 */
const mongouri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/password-manager'

module.exports = {
    apiPort: process.env.PORT || 3001,
    mongouri
  }