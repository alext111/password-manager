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
createLogins = (req, res) => {
    const website = req.body.website
    
    if (!website) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank website',
        })
    }

    const password = passwordGenerator.generatePassword()
    const encrypted = encryptor.encrypt(password)
    const loginInfo = new LoginInfo({ website: website, pw: encrypted.pw, iv: encrypted.iv })
    
    if (!loginInfo) {
        return res.status(400).json({
            success: false,
            error: err,
        })
    }

    loginInfo
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: loginInfo._id,
                message: 'Website added and password generated',
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error,
                message: 'Website not added',
            })
        })

} 

/**
 * Decrypt a stored password
 *
 * Request Params:
 * - pw: encrypted password
 * - iv: initialization vector
 *
 * Response:
 * 200 - Decrypted password returned
 * 400 - Decryption failure
 */
decryptPassword = async (req, res) => {
    const encryption = { pw: req.params.pw, iv: req.params.iv }
    const decryptedPassword = encryptor.decrypt(encryption)

    if (!decryptedPassword) {
        return res.status(400).json({
            success: false,
            error: err,
        })
    }
    
    return res.status(200).json({
        success: true, 
        data: decryptedPassword
    })
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

    await LoginInfo.deleteOne({ website: req.params.website }, (err, website) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!website) {
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        return res.status(200).json({success: true, data: website })
    }).catch(err => console.log(err)) 
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
    
    await LoginInfo.find({}, (err, websites) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!websites.length) {
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        return res.status(200).json({success: true, data: websites })
    }).catch(err => console.log(err))

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

    await LoginInfo.findOne({ website: req.params.website }, (err, logins) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!logins) {
            console.log(res)
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        
        return res.status(200).json({success: true, data: logins })
    }).catch(err => console.log(err))
    
}

/**
 * Update password for an existing website
 *
 * Flow:
 * 1. Validate request body
 * 2. Encrypt new password
 * 3. Update encrypted password and IV in database
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
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank info',
        })
    }

    const password = body.pw
    const encrypted = encryptor.encrypt(password)

    await LoginInfo.updateOne({ website: body.website}, { pw: encrypted.pw, iv: encrypted.iv}, (err, logins) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!logins) {
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        return res.status(200).json({success: true, data: logins })
    }).catch(err => console.log(err))
}

module.exports = {
    createLogins,
    decryptPassword,
    getLogins,
    getPasswordByWebsite,
    updatePassword,
    deleteLogins
}