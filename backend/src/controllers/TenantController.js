import { Tenant, User } from '../models/sequelize.js'

const getAll = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      attributes: ['id', 'name', 'slug']
    })
    res.json(tenants)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getById = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id, {
      attributes: ['id', 'name', 'slug', 'createdAt']
    })
    if (!tenant) return res.status(404).json({ message: 'Tenant no encontrado' })
    res.json(tenant)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id)
    if (!tenant) return res.status(404).json({ message: 'Tenant no encontrado' })
    const { name, slug } = req.body
    await tenant.update({ name, slug })
    res.json(tenant)
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'El slug ya está en uso' })
    }
    res.status(500).json({ message: err.message })
  }
}

const getUsers = async (req, res) => {
  try {
    const tenant = await Tenant.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'users',
        attributes: ['id', 'email', 'createdAt']
      }]
    })
    if (!tenant) return res.status(404).json({ message: 'Tenant no encontrado' })
    res.json(tenant.users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export default { getAll, getById, update, getUsers }
