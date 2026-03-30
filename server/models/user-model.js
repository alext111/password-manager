/**
 * User Information Model
 * ---------------------------------------------------------
 * This module defines the MongoDB schema and model for
 * storing user credentials within the application.
 *
 * Responsibilities:
 * - Define structure of stored user records
 * - Enforce required fields
 *
 * Data Stored:
 * - username: Identifier for the user
 * - passwordHash: Encrypted password for user account (not plaintext)
 *
 * IMPORTANT:
 * This schema stores encrypted password data only.
 * Plaintext passwords are never persisted in the database.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * User Schema
 * 
 * Fields:
 * - username(String, required)
 * 
 * - passwordHash(String, required)
 *      Hash for login validation
 */
const UserSchema = new Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true,
            minLength: 3
        },
        passwordHash: { 
            type: String,
            required: true
        },
    }
)

module.exports = mongoose.model('user', UserSchema)