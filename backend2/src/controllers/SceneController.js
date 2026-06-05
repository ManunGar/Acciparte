import { Scene } from '../models/sequelize.js'

const getAll = async (req, res) => {
  try {
    const scenes = await Scene.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'name', 'createdAt', 'updatedAt'],
      order: [['updatedAt', 'DESC']]
    })
    res.json(scenes)
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

const getById = async (req, res) => {
  try {
    const scene = await Scene.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!scene) return res.status(404).json({ error: 'Escena no encontrada', code: 'NOT_FOUND' })
    res.json(scene)
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

const create = async (req, res) => {
  try {
    const { name, data } = req.body
    const scene = await Scene.create({
      name: name || 'Escena sin titulo',
      data: data || { elements: [] },
      userId: req.user.id
    })
    res.status(201).json(scene)
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

const update = async (req, res) => {
  try {
    const scene = await Scene.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!scene) return res.status(404).json({ error: 'Escena no encontrada', code: 'NOT_FOUND' })
    const { name, data } = req.body
    await scene.update({ name, data })
    res.json(scene)
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

const remove = async (req, res) => {
  try {
    const scene = await Scene.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!scene) return res.status(404).json({ error: 'Escena no encontrada', code: 'NOT_FOUND' })
    await scene.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message, code: 'INTERNAL_ERROR' })
  }
}

export default { getAll, getById, create, update, remove }
