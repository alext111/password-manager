const express = require('express')
const UrlController = require('../controllers/urls-controller')
const router = express.Router()

//url routing for api calls
router.post('/login', UrlController.createLogins)
router.get('/logins', UrlController.getLogins)
router.get('/login/:website', UrlController.getPasswordByWebsite)
router.get('/decrypt/:pw/:iv', UrlController.decryptPassword)
router.put('/login/:website', UrlController.updatePassword)
router.delete('/login/:website', UrlController.deleteLogins)

module.exports = router