const LoginInfo = require('../models/urls-model')

createUrl = (req, res) => {
    const body = req.body
    console.log(body)

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank url',
        })
    }

    const loginInfo = new LoginInfo(body)
    console.log(loginInfo)
    
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





updatePassword = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Cannot have blank url',
        })
    }

    await LoginInfo.updateOne({ url: body.url}, { pw: body.pw}, (err, url) => {
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
    getUrls,
    getPasswordByUrl,
    updatePassword,
    deleteUrl
}