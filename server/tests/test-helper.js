/**
 * Test Helper Module
 * ---------------------------------------------------------
 * Provides utility data and setup information for
 * backend integration tests
 *
 * Responsibilities:
 * - Generate initial login entries for database seeding
 * - Ensure encrypted password data is consistent with
 *   application encryption logic
 * - Export initial test data for use in Jest/Supertest tests
 *
 * Notes:
 * - Passwords are generated randomly using the same
 *   generator as the main application.
 * - Encrypted passwords are used to simulate realistic
 *   database entries.
 */

const loginModel = require('../models/logins-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')

/**
 * Generate and encrypt test passwords
 */
const pw1 = passwordGenerator.generatePassword()
const encrypted1 = encryptor.encrypt(pw1)

const pw2 = passwordGenerator.generatePassword()
const encrypted2 = encryptor.encrypt(pw2)

/**
 * Initial Login Data
 *
 * Used for database seeding before tests
 *
 * Each entry contains:
 * - website: string
 * - pw: encrypted password (hex)
 * - iv: initialization vector (hex)
 */
const initialLoginInfo = [
    {
        website: 'Test1', 
        pw: encrypted1.pw, 
        iv: encrypted1.iv,
        salt: encrypted1.salt
    },
    {
        website: 'Test2', 
        pw: encrypted2.pw, 
        iv: encrypted2.iv,
        salt: encrypted1.salt
    }
]

module.exports = {
    initialLoginInfo
}