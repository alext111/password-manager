/**
 * Password Generation Utility
 * ---------------------------------------------------------
 * This module generates random passwords for new login entries
 * The generator ensures a balanced mix of character types
 * by iterating over a predefined set of random character
 * functions
 */

const randomFunctions = [randomUppercase, randomLowercase, randomNumber, randomSymbol]
const crypto = require('crypto')

/**
 * Generate a random uppercase letter (A–Z).
 *
 * @returns {string} Single uppercase character
 */
function randomUppercase() {
    return String.fromCharCode(crypto.randomInt(65, 91))
}

/**
 * Generate a random lowercase letter (a–z).
 *
 * @returns {string} Single lowercase character
 */
function randomLowercase() {
    return String.fromCharCode(crypto.randomInt(97, 123))
}

/**
 * Generate a random numeric character (0–9).
 *
 * @returns {string} Single numeric character
 */
function randomNumber() {
    return String.fromCharCode(crypto.randomInt(48, 58))
}

/**
 * Generate a random symbol from a predefined set.
 *
 * @returns {string} Single symbol character
 */
function randomSymbol() {
    const symbols = '~!@#$%^&*()_-+={[}]|;<,>.?/'
    return symbols[crypto.randomInt(0, symbols.length)]
}

/**
 * Secure shuffle using crypto.randomInt
 *
 * @param {Array} array
 * @returns {Array} shuffled array
 */
function secureShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = crypto.randomInt(0, i + 1)
        const temp = array[i]
        array[i] = array[randomIndex]
        array[randomIndex] = temp
    }

    return array
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
 * - Securely shuffles the result
 *
 * Result:
 * - Fixed length: 20 characters
 * - Even distribution across character categories
 * - No predictable ordering
 *
 * @returns {string} Generated password
 */
function generatePassword() {
    const pw = []

    for (let i = 0; i < 5; i++) {
        randomFunctions.forEach(fn => {
            pw.push(fn())
        })
    }

    secureShuffle(pw)

    return pw.join('')
}

module.exports = {
    generatePassword
}
