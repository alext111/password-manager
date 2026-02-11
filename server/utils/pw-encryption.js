/**
 * Password Encryption Utility
 * ---------------------------------------------------------
 * This module provides helper functions for encrypting
 * and decrypting passwords using Node.js crypto
 *
 * Algorithm:
 * - AES-256-CTR (Counter mode)
 *
 * Responsibilities:
 * - Encrypt plaintext passwords before database storage
 * - Decrypt stored passwords when requested
 */

const crypto = require("crypto")
const algorithm = 'aes-256-ctr'

// Static key used for demonstration purposes only
// In production, this must be stored securely
const keypw = 'thisisfakekeyforthegithubversion'

/**
 * Encrypt a plaintext password
 *
 * Process:
 * 1. Generate a random 16-byte initialization vector (IV)
 * 2. Create cipher instance using AES-256-CTR
 * 3. Encrypt password
 * 4. Return encrypted password and IV as hexadecimal strings
 *
 * @param {string} password - Plaintext password
 * @returns {Object} { pw: string, iv: string }
 *          pw - Encrypted password (hex)
 *          iv - Initialization vector (hex)
 */
const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16))
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(keypw), iv)
    const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()])

    return {pw: encryptedPassword.toString('hex'), iv: iv.toString('hex') }
}

/**
 * Decrypt an encrypted password
 *
 * Process:
 * 1. Recreate decipher using stored IV
 * 2. Convert encrypted password from hex to buffer
 * 3. Decrypt and return plaintext password
 *
 * @param {Object} encryption
 * @param {string} encryption.pw - Encrypted password (hex)
 * @param {string} encryption.iv - Initialization vector (hex)
 * @returns {string} Decrypted plaintext password
 */
const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(keypw), Buffer.from(encryption.iv, 'hex'))
    const decryptedPassword = Buffer.concat([decipher.update(Buffer.from(encryption.pw, 'hex')), decipher.final()])
    
    return decryptedPassword.toString()
}

module.exports = {
    encrypt,
    decrypt
}
