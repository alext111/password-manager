const LoginInfo = require('../models/urls-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')

//create login info from url
createUrl = (req, res) => {
    const url = req.body.url
    
    if (!url) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank url',
        })
    }

    const password = passwordGenerator.generatePassword()
    const encrypted = encryptor.encrypt(password)
    const loginInfo = new LoginInfo({ url: url, pw: encrypted.pw, iv: encrypted.iv })
    
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
                message: 'Url added and password generated',
            })
        })
        .catch(error => {
            return res.status(400).json({
                success: false,
                error,
                message: 'Url not added',
            })
        })

} 

//decrypt password using utils
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

//delete login info from url
deleteUrl = async (req, res) => {
    await LoginInfo.deleteOne({ url: req.params.url }, (err, url) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!url) {
            return res.status(404).json({ success: false, error: 'Url not found' })
        }
        return res.status(200).json({success: true, data: url })
    }).catch(err => console.log(err)) 
}

//get all login info in database
getUrls = async (req, res) => {
    
    await LoginInfo.find({}, (err, urls) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!urls.length) {
            return res.status(404).json({ success: false, error: 'Url not found' })
        }
        return res.status(200).json({success: true, data: urls })
    }).catch(err => console.log(err))

}

//get password for url
getPasswordByUrl = async (req, res) => {

    await LoginInfo.findOne({ url: req.params.url }, (err, logins) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!logins) {
            console.log(res)
            return res.status(404).json({ success: false, error: 'Url not found' })
        }
        
        return res.status(200).json({success: true, data: logins })
    }).catch(err => console.log(err))
    
}

//update password for url
updatePassword = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank info',
        })
    }

    //encrypt user inputted password and save encrypted password and new iv
    const password = body.pw
    const encrypted = encryptor.encrypt(password)

    await LoginInfo.updateOne({ url: body.url}, { pw: encrypted.pw, iv: encrypted.iv}, (err, url) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!url) {
            return res.status(404).json({ success: false, error: 'Url not found' })
        }
        return res.status(200).json({success: true, data: url })
    }).catch(err => console.log(err))
}

module.exports = {
    createUrl,
    decryptPassword,
    getUrls,
    getPasswordByUrl,
    updatePassword,
    deleteUrl
}