import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { User, RefreshToken } from '../models/sequelize.js'

const JWT_SECRET = process.env.JWT_SECRET || 'acciparte_caso2_secret'
const JWT_EXPIRY = '1h'
const REFRESH_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000

const generateAccessToken = (user) =>
  jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY })

const createRefreshToken = (userId) =>
  RefreshToken.create({ token: randomUUID(), userId, expiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS) })

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    const accessToken = generateAccessToken(user)
    const { token: refreshToken } = await createRefreshToken(user.id)
    res.json({ accessToken, refreshToken })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const register = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.create({ email, password })
    const accessToken = generateAccessToken(user)
    const { token: refreshToken } = await createRefreshToken(user.id)
    res.status(201).json({ accessToken, refreshToken })
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ message: 'El email ya esta registrado' })
    res.status(500).json({ message: err.message })
  }
}

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const stored = await RefreshToken.findOne({ where: { token: refreshToken }, include: [{ model: User, as: 'user' }] })
    if (!stored) return res.status(401).json({ message: 'Refresh token invalido' })
    if (new Date() > stored.expiresAt) { await stored.destroy(); return res.status(401).json({ message: 'Expirado' }) }
    res.json({ accessToken: generateAccessToken(stored.user) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'createdAt']
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const findByToken = async (token) => {
  const payload = jwt.verify(token, JWT_SECRET)
  const user = await User.findByPk(payload.id)
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

export default { login, register, refresh, me, findByToken }
