const express = require('express')
const path = require('path')
const routes = require('./routes')

const app = express()

app.use(express.static(path.join(__dirname,'..', 'public')))
app.use(express.json())

app.use(
  '/leaflet',
  express.static(path.join(__dirname, '..', 'node_modules', 'leaflet', 'dist'))
)

app.use(
  '/bootstrap',
  express.static(path.join(__dirname, '..', 'node_modules', 'bootstrap', 'dist'))
)

app.use('/api', routes)

module.exports = app