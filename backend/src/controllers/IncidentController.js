import { Incident } from '../models/sequelize.js'

/**
 * GET /incidents
 * Devuelve todas las incidencias del tenant del usuario autenticado.
 */
const getAll = async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      where: { tenantId: req.user.tenantId },
      order: [['createdAt', 'DESC']]
    })
    res.json(incidents)
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

/**
 * GET /incidents/:id
 * Devuelve una incidencia concreta, verificando que pertenece al tenant.
 */
const getById = async (req, res) => {
  try {
    const incident = await Incident.findOne({
      where: { id: req.params.id, tenantId: req.user.tenantId }
    })
    if (!incident) {
      return res.status(404).json({ error: 'Incidencia no encontrada', code: 'NOT_FOUND' })
    }
    res.json(incident)
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

/**
 * POST /incidents
 * Crea una nueva incidencia asociada al tenant y al usuario autenticado.
 * El tenantId se extrae siempre del JWT, nunca del body.
 */
const create = async (req, res) => {
  try {
    const { firstName, lastName, location, interventionType } = req.body

    const incident = await Incident.create({
      firstName,
      lastName,
      location,
      interventionType,
      userId: req.user.id,
      tenantId: req.user.tenantId
    })

    res.status(201).json(incident)
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

/**
 * DELETE /incidents/:id
 * Elimina una incidencia, verificando que pertenece al tenant.
 */
const remove = async (req, res) => {
  try {
    const incident = await Incident.findOne({
      where: { id: req.params.id, tenantId: req.user.tenantId }
    })
    if (!incident) {
      return res.status(404).json({ error: 'Incidencia no encontrada', code: 'NOT_FOUND' })
    }
    await incident.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

export default { getAll, getById, create, remove }
