const express = require('express')
const countriesController = require('./controllers/countries.controller')

const router = express.Router()

// Countries
router.get('/countries', countriesController.list)
router.get('/countries/:id', countriesController.getById)
router.post('/countries', countriesController.create)
router.patch('/countries/:id', countriesController.update)
router.delete('/countries/:id', countriesController.remove)

module.exports = router