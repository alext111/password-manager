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
const authMiddleware = require('../middleware/auth-middleware')

/**
 * POST /auth/register
 *
 * Register new user
 * 
 */
router.post('/auth/register', UrlController.registerUser)

/**
 * POST /auth/login
 *
 * Login user
 * 
 */
router.post('/auth/login', UrlController.loginUser)

/**
 * POST /credentials
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
router.post('/credentials', authMiddleware, UrlController.createCredentials)

/**
 * GET /credentials
 *
 * Retrieve all stored login entries
 *
 * Returns:
 * - Array of login records (encrypted passwords)
 */
router.get('/credentials', authMiddleware, UrlController.getAllCredentials)

/**
 * GET /credentials/:website
 *
 * Retrieve login entry by website identifier
 *
 * Params:
 * - website: string
 */
router.get('/credentials/:website', authMiddleware, UrlController.getPasswordByWebsite)

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
router.get('/decrypt/:website', authMiddleware, UrlController.decryptPassword)

/**
 * PUT /credentials/:website
 *
 * Update password for a specific website
 *
 * Body:
 * {
 *   website: string,
 *   pw: string
 * }
 */
router.put('/credentials/:website', authMiddleware, UrlController.updatePassword)

/**
 * DELETE /credentials/:website
 *
 * Delete login entry by website identifier
 *
 * Params:
 * - website: string
 */
router.delete('/credentials/:website', authMiddleware, UrlController.deleteCredentials)

module.exports = router