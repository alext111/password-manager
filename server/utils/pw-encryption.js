/**
 * Password Encryption Utility
 * ---------------------------------------------------------
 * This module provides helper functions for encrypting
 * and decrypting passwords using Node.js crypto
 *
 * Algorithm:
 * - AES-256-CTR (Counter mode)
 * 
 * Key Derivation:
 * - PBKDF2 (Password-Based Key Derivation Function 2)
 * - SHA-256 hashing
 * - 100,000 iterations
 *
 * Security Features:
 * - Random salt generated per password entry
 * - Random 16-byte initialization vector (IV)
 * - 256-bit derived encryption key
 * 
 * Responsibilities:
 * - Encrypt plaintext passwords before database storage
 * - Decrypt stored passwords when requested
 */

require('dotenv').config({ path: '../.env'})

const crypto = require("crypto")
const algorithm = 'aes-256-ctr'
const masterKey = process.env.ENCRYPTION_KEY

if (!masterKey) {
    throw new Error("ENCRYPTION_KEY is not defined in environment variables")
}

const ITERATIONS = 100000
const KEY_LENGTH = 32
const DIGEST = 'sha256'

/**
 * Encrypt a plaintext password
 *
 * Process:
 * 1. Generate a random salt for PBKDF2 key derivation
 * 2. Derive a 256-bit encryption key from the master key using PBKDF2
 * 3. Generate a random 16-byte initialization vector (IV)
 * 4. Encrypt the plaintext password using AES-256-CTR
 * 5. Store the encrypted password along with the IV and salt
 *
 * @param {string} password - Plaintext password
 * @returns {Object} { pw: string, iv: string }
 *          pw - Encrypted password (hex)
 *          iv - Initialization vector (hex)
 *          salt - Random salt for key derivation (hex)
 */
const encrypt = (password) => {
    const iv = crypto.randomBytes(16)
    const salt = crypto.randomBytes(16)

    const derivedKey = crypto.pbkdf2Sync(
        masterKey,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST
    )

    const cipher = crypto.createCipheriv(algorithm, derivedKey, iv)
    const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()])

    return {pw: encryptedPassword.toString('hex'), iv: iv.toString('hex'), salt: salt.toString('hex') }
}

/**
 * Decrypt an encrypted password
 *
 * Process:
 * 1. Retrieve stored salt and IV
 * 2. Derive the same encryption key using PBKDF2
 * 3. Recreate the AES decipher with the derived key and IV
 * 4. Decrypt the stored password and return plaintext
 *
 * @param {Object} encryption
 * @param {string} encryption.pw - Encrypted password (hex)
 * @param {string} encryption.iv - Initialization vector (hex)
 * @param {string} encryption.salt - Salt (hex)
 * @returns {string} Decrypted plaintext password
 */
const decrypt = (encryption) => {
    const salt = Buffer.from(encryption.salt, 'hex')

    const derivedKey = crypto.pbkdf2Sync(
        masterKey,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        DIGEST
    )

    const decipher = crypto.createDecipheriv(algorithm, derivedKey, Buffer.from(encryption.iv, 'hex'))
    const decryptedPassword = Buffer.concat([decipher.update(Buffer.from(encryption.pw, 'hex')), decipher.final()])
    
    return decryptedPassword.toString()
}

module.exports = {
    encrypt,
    decrypt
}
