const placesService = require('../services/places.service')

// GET /api/places?countryId=...&type=...
async function list(req, res, next) {
  try {
    const { countryId, type } = req.query
    const places = await placesService.list({ countryId, type })
    res.json(places)
  } catch (err) {
    next(err)
  }
}

// GET /api/places/:id
async function getById(req, res, next) {
  try {
    const place = await placesService.getById(req.params.id)
    res.json(place)
  } catch (err) {
    next(err)
  }
}

// POST /api/places
async function create(req, res, next) {
  try {
    const created = await placesService.create(req.body)
    res.status(201).json(created)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/places/:id
async function update(req, res, next) {
  try {
    const updated = await placesService.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/places/:id
async function remove(req, res, next) {
  try {
    await placesService.remove(req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove
}