const express = require('express')
const UrlController = require('../controllers/urls-controller')
const router = express.Router()

//url routing for api calls
router.post('/url', UrlController.createUrl)
router.get('/urls', UrlController.getUrls)
router.get('/url/:url', UrlController.getPasswordByUrl)
router.put('/url/:url', UrlController.updatePassword)
router.delete('/url/:url', UrlController.deleteUrl)

module.exports = router