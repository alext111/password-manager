const LoginInfo = require('../models/logins-model')
const passwordGenerator = require('../utils/pw-generator')
const encryptor = require('../utils/pw-encryption')

//create login info from website
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

//delete login info from website
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

//get all login info in database
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

//get password for website
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

//update password for website
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