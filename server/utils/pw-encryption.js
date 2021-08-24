const crypto = require("crypto")
const algorithm = 'aes-256-ctr'
const keypw = 'thisisfakekeyforthegithubversion'

//encrypt password to create hexadecimal password string and initialization vector
const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16))
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(keypw), iv)
    const encryptedPassword = Buffer.concat([cipher.update(password), cipher.final()])

    return {pw: encryptedPassword.toString('hex'), iv: iv.toString('hex') }
}

//decrypt the encrypted password with initialization vector
const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(keypw), Buffer.from(encryption.iv, 'hex'))
    const decryptedPassword = Buffer.concat([decipher.update(Buffer.from(encryption.pw, 'hex')), decipher.final()])
    
    return decryptedPassword.toString()
}

module.exports = {
    encrypt,
    decrypt
}
