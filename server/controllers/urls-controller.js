/**
 * URL / Login Controllers
 * ---------------------------------------------------------
 * This module contains controller functions for managing
 * login entries within the password manager application.
 *
 * Responsibilities:
 * - Generate and encrypt passwords
 * - Store encrypted login data in MongoDB
 * - Retrieve and decrypt stored passwords
 * - Update and delete login records
 *
 */

const LoginInfo = require('../models/logins-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')

/**
 * Create a new login entry
 *
 * Flow:
 * 1. Validate website input
 * 2. Generate a random password
 * 3. Encrypt the password
 * 4. Store encrypted password + IV in database
 *
 * Request Body:
 * {
 *   website: string
 * }
 *
 * Response:
 * 201 - Created
 * 400 - Validation or database error
 */
createLogins = async (req, res) => {
    const website = req.body.website
    
    if (!website) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank website',
        })
    }

    const password = passwordGenerator.generatePassword()
    const encrypted = encryptor.encrypt(password)
    const loginInfo = new LoginInfo({ website: website, pw: encrypted.pw, iv: encrypted.iv, salt: encrypted.salt })
    
    try {
        await loginInfo.save()
        return res.status(201).json({
            success: true,
            id: loginInfo._id,
            message: 'Website added and password generated',
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error,
            message: 'Website not added',
        })
    }
} 

/**
 * Decrypt a stored password
 *
 * Request Params:
 * - pw: encrypted password
 * - iv: initialization vector
 * - salt: salt
 *
 * Response:
 * 200 - Decrypted password returned
 * 400 - Decryption failure
 */
decryptPassword = async (req, res) => {
    try {
        const login = await LoginInfo.findOne({ website: req.params.website })

        if (!login) {
            return res.status(404).json({
                success: false,
                error: 'Website not found'
            })
        }

        const decryptedPassword = encryptor.decrypt({
            pw: login.pw,
            iv: login.iv,
            salt: login.salt
        })

        return res.status(200).json({
            success: true,
            data: decryptedPassword
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err
        })
    }
}

/**
 * Delete a login entry by website name
 *
 * Request Params:
 * - website: string
 *
 * Response:
 * 200 - Deleted successfully
 * 400 - Database error
 * 404 - Website not found
 */
deleteLogins = async (req, res) => {
    try {
        const result = await LoginInfo.deleteOne({ website: req.params.website })
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        return res.status(200).json({ success: true, data: result })
    } catch (err) {
        return res.status(400).json({ success: false, error: err })
    }
}

/**
 * Retrieve all stored login entries
 *
 * Response:
 * 200 - List of login records
 * 400 - Database error
 * 404 - Website records not found
 */
getLogins = async (req, res) => {
    try {
        const websites = await LoginInfo.find({})
        if (!websites.length) {
            return res.status(404).json({ success: false, error: 'No websites found' })
        }
        return res.status(200).json({ success: true, data: websites })
    } catch (err) {
        return res.status(400).json({ success: false, error: err })
    }
}

/**
 * Retrieve login entry by website
 *
 * Request Params:
 * - website: string
 *
 * Response:
 * 200 - Login entry returned
 * 400 - Database error
 * 404 - Website not found
 */
getPasswordByWebsite = async (req, res) => {
    try {
        const logins = await LoginInfo.findOne({ website: req.params.website })
        if (!logins) {
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        return res.status(200).json({ success: true, data: logins })
    } catch (err) {
        return res.status(400).json({ success: false, error: err })
    }
}

/**
 * Update password for an existing website
 *
 * Flow:
 * 1. Validate request body
 * 2. Encrypt new password
 * 3. Update encrypted password, IV, and salt in database
 *
 * Request Body:
 * {
 *   website: string,
 *   pw: string
 * }
 *
 * Response:
 * 200 - Updated successfully
 * 400 - Validation or database error
 * 404 - Website not found
 */
updatePassword = async (req, res) => {
    const { website, pw } = req.body
    if (!website || !pw) {
        return res.status(400).json({ success: false, error: 'Cannot have blank info' })
    }

    const encrypted = encryptor.encrypt(pw)

    try {
        const result = await LoginInfo.updateOne(
            { website },
            { pw: encrypted.pw, iv: encrypted.iv, salt: encrypted.salt }
        )
        if (result.matchedCount === 0) {
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        return res.status(200).json({ success: true, data: result })
    } catch (err) {
        return res.status(400).json({ success: false, error: err })
    }
}

module.exports = {
    createLogins,
    decryptPassword,
    getLogins,
    getPasswordByWebsite,
    updatePassword,
    deleteLogins
}