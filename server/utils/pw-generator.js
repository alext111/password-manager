/**
 * Password Generation Utility
 * ---------------------------------------------------------
 * This module generates random passwords for new login entries
 *
 * Password Structure:
 * - 20 characters total
 * - 5 uppercase letters
 * - 5 lowercase letters
 * - 5 numbers
 * - 5 symbols
 *
 * The generator ensures a balanced mix of character types
 * by iterating over a predefined set of random character
 * functions
 *
 * NOTE:
 * This is a demonstration implementation.
 * It uses Math.random(), which is not cryptographically secure.
 * In a production-grade password manager, a secure random
 * generator (e.g., crypto.randomBytes) should be used.
 */

const randomFunctions = [randomUppercase, randomLowercase, randomNumber, randomSymbol]

/**
 * Generate a random uppercase letter (A–Z).
 * ASCII range: 65–90
 *
 * @returns {string} Single uppercase character
 */
function randomUppercase() {
    return String.fromCharCode(Math.floor(Math.random()*26+65))
}

/**
 * Generate a random lowercase letter (a–z).
 * ASCII range: 97–122
 *
 * @returns {string} Single lowercase character
 */
function randomLowercase() {
    return String.fromCharCode(Math.floor(Math.random()*26+97))
}

/**
 * Generate a random numeric character (0–9).
 * ASCII range: 48–57
 *
 * @returns {string} Single numeric character
 */
function randomNumber() {
    return String.fromCharCode(Math.floor(Math.random()*10+48))
}

/**
 * Generate a random symbol from a predefined set.
 *
 * @returns {string} Single symbol character
 */
function randomSymbol() {
    const symbols = '~!@#$%^&*()_-+={[}]|;<,>.?/'
    return symbols[Math.floor(Math.random()*symbols.length)]
}

/**
 * Generate a 20-character password.
 *
 * Implementation:
 * - Iterates 5 times
 * - Each iteration appends:
 *   1 uppercase
 *   1 lowercase
 *   1 number
 *   1 symbol
 *
 * Result:
 * - Fixed length: 20 characters
 * - Even distribution across character categories
 *
 * @returns {string} Generated password
 */
function generatePassword() {
    pw = ''
    for(let i = 0; i<5; i++) {
        randomFunctions.forEach(element => {
            pw += element()
        });
    }
    return pw
}

module.exports = {
    generatePassword
}
