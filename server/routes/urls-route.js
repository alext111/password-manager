const express = require('express')
const UrlController = require('../controllers/urls-controller')
const router = express.Router()

//url routing for api calls
router.post('/login', UrlController.createUrl)
router.get('/logins', UrlController.getUrls)
router.get('/login/:url', UrlController.getPasswordByUrl)
router.get('/decrypt/:pw/:iv', UrlController.decryptPassword)
router.put('/login/:url', UrlController.updatePassword)
router.delete('/login/:url', UrlController.deleteUrl)

module.exports = router