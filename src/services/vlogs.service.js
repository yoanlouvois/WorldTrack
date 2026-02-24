const prisma = require('../prisma')

// --------- Helpers ---------
function toDateOrThrow(value, fieldName) {
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) throw new Error(`${fieldName} must be a valid date`)
  return d
}

// --------- VLOG CRUD ---------

async function list(){
    return prisma.vlog.findMany({
        orderBy: { date: 'desc' }
    })
}

async function listByCountry({ countryId } = {}) {
  const where = countryId
    ? { countryVlogs: { some: { countryId } } }
    : {}
  return prisma.vlog.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      countryVlogs: { include: { country: true } }
    }
  })
}

async function getById(id) {
  if (!id) throw new Error('Vlog id is required')

  const vlog = await prisma.vlog.findUnique({
    where: { id },
    include: {
      countryVlogs: { include: { country: true } }
    }
  })

  if (!vlog) throw new Error('Vlog not found')
  return vlog
}

/**
 * data attendu:
 * {
 *   title, urlOrPath, date, description,
 *   countryIds?: string[]   // optionnel pour lier dès la création
 * }
 */
async function create(data) {
  if (!data?.title || !data?.urlOrPath || !data?.date || !data?.description) {
    throw new Error('title, urlOrPath, date and description are required')
  }

  const date = toDateOrThrow(data.date, 'date')
  const countryIds = Array.isArray(data.countryIds) ? data.countryIds : []

  // Optionnel: vérifier que les countryIds existent (plus sûr)
  if (countryIds.length > 0) {
    const count = await prisma.country.count({ where: { id: { in: countryIds } } })
    if (count !== countryIds.length) throw new Error('One or more countryIds are invalid')
  }

  return prisma.vlog.create({
    data: {
      title: data.title,
      urlOrPath: data.urlOrPath,
      date,
      description: data.description,
      countryVlogs: countryIds.length
        ? {
            create: countryIds.map((countryId) => ({
              country: { connect: { id: countryId } }
            }))
          }
        : undefined
    },
    include: {
      countryVlogs: { include: { country: true } }
    }
  })
}

async function update(id, data) {
  if (!id) throw new Error('Vlog id is required')

  const updateData = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.urlOrPath !== undefined) updateData.urlOrPath = data.urlOrPath
  if (data.description !== undefined) updateData.description = data.description
  if (data.date !== undefined) updateData.date = toDateOrThrow(data.date, 'date')

  return prisma.vlog.update({
    where: { id },
    data: updateData,
    include: {
      countryVlogs: { include: { country: true } }
    }
  })
}

async function remove(id) {
  if (!id) throw new Error('Vlog id is required')
  return prisma.vlog.delete({ where: { id } })
}

// --------- LINKING COUNTRIES <-> VLOG ---------

async function linkToCountry(vlogId, countryId) {
  if (!vlogId) throw new Error('vlogId is required')
  if (!countryId) throw new Error('countryId is required')

  // upsert évite l’erreur si le lien existe déjà
  return prisma.countryVlog.upsert({
    where: { countryId_vlogId: { countryId, vlogId } },
    create: { countryId, vlogId },
    update: {}
  })
}

async function unlinkFromCountry(vlogId, countryId) {
  if (!vlogId) throw new Error('vlogId is required')
  if (!countryId) throw new Error('countryId is required')

  return prisma.countryVlog.delete({
    where: { countryId_vlogId: { countryId, vlogId } }
  })
}

/**
 * Remplace la liste des pays liés à un vlog par une nouvelle liste.
 * Très utile pour un écran "éditer vlog" avec multi-select.
 */
async function setCountries(vlogId, countryIds) {
  if (!vlogId) throw new Error('vlogId is required')
  if (!Array.isArray(countryIds)) throw new Error('countryIds must be an array')

  // Optionnel: vérifier existence des pays
  const count = await prisma.country.count({ where: { id: { in: countryIds } } })
  if (count !== countryIds.length) throw new Error('One or more countryIds are invalid')

  await prisma.countryVlog.deleteMany({ where: { vlogId } })

  if (countryIds.length > 0) {
    await prisma.countryVlog.createMany({
      data: countryIds.map((countryId) => ({ countryId, vlogId })),
      //skipDuplicates: true
    })
  }

  return getById(vlogId)
}

module.exports = {
  list,
  listByCountry,
  getById,
  create,
  update,
  remove,
  linkToCountry,
  unlinkFromCountry,
  setCountries
}