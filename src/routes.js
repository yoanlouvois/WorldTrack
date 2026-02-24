const express = require('express')
const countriesController = require('./controllers/countries.controller')
const vlogsController = require('./controllers/vlogs.controller')

const router = express.Router()

// Countries
router.get('/countries', countriesController.list)
router.get('/countries/:id', countriesController.getById)
router.post('/countries', countriesController.create)
router.patch('/countries/:id', countriesController.update)
router.delete('/countries/:id', countriesController.remove)

// Vlogs
router.get('/vlogs', vlogsController.list)
router.get('/vlogs/:id', vlogsController.getById)
router.post('/vlogs', vlogsController.create)
router.patch('/vlogs/:id', vlogsController.update)
router.delete('/vlogs/:id', vlogsController.remove)

// liens Vlog / Country
router.post('/vlogs/:id/countries/:countryId', vlogsController.linkToCountry)
router.delete('/vlogs/:id/countries/:countryId', vlogsController.unlinkFromCountry)
router.put('/vlogs/:id/countries', vlogsController.setCountries)

module.exports = router