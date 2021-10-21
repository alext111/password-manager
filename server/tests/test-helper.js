const loginModel = require('../models/logins-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')

const pw1 = passwordGenerator.generatePassword()
const encrypted1 = encryptor.encrypt(pw1)

const pw2 = passwordGenerator.generatePassword()
const encrypted2 = encryptor.encrypt(pw2)

const initialLoginInfo = [
    {
        website: 'Test1', 
        pw: encrypted1.pw, 
        iv: encrypted1.iv
    },
    {
        website: 'Test2', 
        pw: encrypted2.pw, 
        iv: encrypted2.iv
    }
]

module.exports = {
    initialLoginInfo
}