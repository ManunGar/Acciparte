import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { User, Tenant, RefreshToken, sequelizeConnection } from '../models/sequelize.js'

const JWT_SECRET = process.env.JWT_SECRET || 'acciparte_dev_secret'
const JWT_EXPIRY = '1h'
const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000

const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, tenantId: user.tenantId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })

const createRefreshToken = (userId) =>
  RefreshToken.create({
    token: randomUUID(),
    userId,
    expiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS)
  })

const slugify = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    const accessToken = generateAccessToken(user)
    const { token: refreshToken } = await createRefreshToken(user.id)
    res.json({ accessToken, refreshToken })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const register = async (req, res) => {
  const { email, password, tenantId, tenantName } = req.body
  if (!tenantId && !tenantName) {
    return res.status(400).json({ message: 'Debes seleccionar o crear una organización' })
  }
  const t = await sequelizeConnection.transaction()
  try {
    let resolvedTenantId = tenantId
    if (!tenantId) {
      const tenant = await Tenant.create(
        { name: tenantName, slug: slugify(tenantName) },
        { transaction: t }
      )
      resolvedTenantId = tenant.id
    }
    const user = await User.create(
      { email, password, tenantId: resolvedTenantId },
      { transaction: t }
    )
    await t.commit()
    const accessToken = generateAccessToken(user)
    const { token: refreshToken } = await createRefreshToken(user.id)
    res.status(201).json({ accessToken, refreshToken })
  } catch (err) {
    await t.rollback()
    if (err.name === 'SequelizeUniqueConstraintError') {
      const field = err.errors?.[0]?.path
      if (field === 'slug') return res.status(409).json({ message: 'Ya existe una organización con ese nombre' })
      return res.status(409).json({ message: 'El email ya está registrado' })
    }
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'La organización seleccionada no existe' })
    }
    res.status(500).json({ message: err.message })
  }
}

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const stored = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: [{ model: User, as: 'user' }]
    })
    if (!stored) return res.status(401).json({ message: 'Refresh token inválido' })
    if (new Date() > stored.expiresAt) {
      await stored.destroy()
      return res.status(401).json({ message: 'Refresh token expirado' })
    }
    res.json({ accessToken: generateAccessToken(stored.user) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'tenantId', 'createdAt'],
      include: [{ model: Tenant, as: 'tenant', attributes: ['id', 'name', 'slug'] }]
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Usado por passport.js — lanza error si el token no es válido o el usuario no existe
const findByToken = async (token) => {
  const payload = jwt.verify(token, JWT_SECRET)
  const user = await User.findByPk(payload.id)
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

export default { login, register, refresh, me, findByToken }
