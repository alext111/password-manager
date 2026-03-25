/**
 * Credentials Information Model
 * ---------------------------------------------------------
 * This module defines the MongoDB schema and model for
 * storing website login credentials within the application.
 *
 * Responsibilities:
 * - Define structure of stored credential records
 * - Enforce required fields
 * - Enable automatic timestamp tracking
 *
 * Data Stored:
 * - website: Identifier for the associated service
 * - pw: Encrypted password (not plaintext)
 * - iv: Initialization vector used during encryption
 *
 * IMPORTANT:
 * This schema stores encrypted password data only.
 * Plaintext passwords are never persisted in the database.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * CredentialsSchema
 *
 * Fields:
 * - website (String, required)
 *     Name or identifier of the service associated with the login
 *
 * - pw (String, required)
 *     Encrypted password value
 *
 * - iv (String, required)
 *     Initialization vector used during encryption
 *
 * Options:
 * - timestamps: Automatically adds createdAt and updatedAt fields
 */
const CredentialsSchema = new Schema(
    {
        website: { type: String, required: true },
        pw: { type: String, required: true},
        iv: { type: String, required: true},
        salt: { type: String, required: true},
        //userId: { type: String, requried: true},
    },
    { timestamps: true },
)



/**
 * Export Mongoose model
 *
 * Collection name: 'credentials'
 * Documents conform to CredentialsSchema
 */
module.exports = mongoose.model('credentials', CredentialsSchema)
