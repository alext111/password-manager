/**
 * URL / Login Controllers
 * ---------------------------------------------------------
 * This module contains controller functions for managing
 * credentials entries within the password manager application.
 *
 * Responsibilities:
 * - Register new user in MongoDB
 * - Generate and encrypt passwords
 * - Store encrypted credentials data in MongoDB
 * - Retrieve and decrypt stored passwords
 * - Update and delete credentials records
 *
 */

const CredentialsSchema = require('../models/credentials-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')

const bcrypt = require('bcrypt')
const User = require('../models/user-model')

const jwt = require('jsonwebtoken')

register = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Username already exists'
      })
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create new user
    const newUser = new User({
      username,
      passwordHash
    })

    await newUser.save()

    return res.status(201).json({
      success: true,
      message: 'User created successfully'
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}

credentials = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      })
    }

    // Create JWT
    const userForToken = {
      id: user._id,
      username: user.username
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: '1h'
    })

    res.status(200).json({
      success: true,
      token,
      username: user.username
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      error: 'Server error'
    })
  }
}


/**
 * Create a new credential entry
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
createCredentials = async (req, res) => {
    const website = req.body.website
    
    if (!website) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank website',
        })
    }

    const password = passwordGenerator.generatePassword()
    const encrypted = encryptor.encrypt(password)
    const credentials = new CredentialsSchema({ website: website, pw: encrypted.pw, iv: encrypted.iv, salt: encrypted.salt })
    
    try {
        await credentials.save()
        return res.status(201).json({
            success: true,
            id: CredentialsSchema._id,
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
        const credentials = await CredentialsSchema.findOne({ website: req.params.website })

        if (!credentials) {
            return res.status(404).json({
                success: false,
                error: 'Website not found'
            })
        }

        const decryptedPassword = encryptor.decrypt({
            pw: credentials.pw,
            iv: credentials.iv,
            salt: credentials.salt
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
deleteCredentials = async (req, res) => {
    try {
        const result = await CredentialsSchema.deleteOne({ website: req.params.website })
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
getAllCredentials = async (req, res) => {
    try {
        const websites = await CredentialsSchema.find({})
        

        /*
        //leads to page crash
        if (!websites.length) {
            return res.status(404).json({ success: false, error: 'No websites found' })
        }
        */
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
    const website = req.params.website

    if (!website || website.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'Website is required'
        })
    }

    try {
        const credentials = await CredentialsSchema.findOne({ website: req.params.website })
        if (!credentials) {
            return res.status(404).json({ success: false, error: 'Website not found' })
        }
        return res.status(200).json({ success: true, data: credentials })
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
        const result = await CredentialsSchema.updateOne(
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
    createCredentials,
    decryptPassword,
    getAllCredentials,
    getPasswordByWebsite,
    updatePassword,
    deleteCredentials
}