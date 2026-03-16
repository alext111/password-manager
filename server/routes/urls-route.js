/**
 * URL Routing Module
 * ---------------------------------------------------------
 * Defines API routes for managing login credentials.
 *
 * This router maps HTTP endpoints to controller methods
 * responsible for:
 * - Creating login entries
 * - Retrieving stored logins
 * - Decrypting passwords
 * - Updating credentials
 * - Deleting login records
 *
 * Base Path:
 * These routes are typically mounted under an API prefix
 * (/api) in the main Express application.
 */

const express = require('express')
const UrlController = require('../controllers/urls-controller')
const router = express.Router()

/**
 * POST /login
 *
 * Create a new login entry
 * - Generates a password
 * - Encrypts it
 * - Stores encrypted password + IV in database
 *
 * Body:
 * {
 *   website: string
 * }
 */
router.post('/login', UrlController.createLogins)

/**
 * GET /logins
 *
 * Retrieve all stored login entries
 *
 * Returns:
 * - Array of login records (encrypted passwords)
 */
router.get('/logins', UrlController.getLogins)

/**
 * GET /login/:website
 *
 * Retrieve login entry by website identifier
 *
 * Params:
 * - website: string
 */
router.get('/login/:website', UrlController.getPasswordByWebsite)

/**
 * GET /decrypt/:pw/:iv
 *
 * Decrypt a stored password using encrypted value
 * and initialization vector
 *
 * Params:
 * - pw: encrypted password (hex)
 * - iv: initialization vector (hex)
 *
 * Returns:
 * - Decrypted plaintext password
 */
router.get('/decrypt/:website', UrlController.decryptPassword)

/**
 * PUT /login/:website
 *
 * Update password for a specific website
 *
 * Body:
 * {
 *   website: string,
 *   pw: string
 * }
 */
router.put('/login/:website', UrlController.updatePassword)

/**
 * DELETE /login/:website
 *
 * Delete login entry by website identifier
 *
 * Params:
 * - website: string
 */
router.delete('/login/:website', UrlController.deleteLogins)

module.exports = router