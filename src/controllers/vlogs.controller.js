const vlogsService = require('../services/vlogs.service')

// GET /api/vlogs
// Option: /api/vlogs?countryId=xxx  -> listByCountry
async function list(req, res, next) {
  try {
    const { countryId } = req.query

    if (countryId) {
      const vlogs = await vlogsService.listByCountry({ countryId })
      return res.json(vlogs)
    }

    const vlogs = await vlogsService.list()
    return res.json(vlogs)
  } catch (err) {
    next(err)
  }
}

// GET /api/vlogs/:id
async function getById(req, res, next) {
  try {
    const vlog = await vlogsService.getById(req.params.id)
    res.json(vlog)
  } catch (err) {
    next(err)
  }
}

// POST /api/vlogs
async function create(req, res, next) {
  try {
    const created = await vlogsService.create(req.body)
    res.status(201).json(created)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/vlogs/:id
async function update(req, res, next) {
  try {
    const updated = await vlogsService.update(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/vlogs/:id
async function remove(req, res, next) {
  try {
    await vlogsService.remove(req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

// POST /api/vlogs/:id/countries/:countryId
async function linkToCountry(req, res, next) {
  try {
    const { id, countryId } = req.params
    const link = await vlogsService.linkToCountry(id, countryId)
    res.status(201).json(link)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/vlogs/:id/countries/:countryId
async function unlinkFromCountry(req, res, next) {
  try {
    const { id, countryId } = req.params
    await vlogsService.unlinkFromCountry(id, countryId)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

// PUT /api/vlogs/:id/countries
// Body: { countryIds: ["...", "..."] }
async function setCountries(req, res, next) {
  try {
    const { id } = req.params
    const { countryIds } = req.body
    const updated = await vlogsService.setCountries(id, countryIds)
    res.json(updated)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  linkToCountry,
  unlinkFromCountry,
  setCountries
}