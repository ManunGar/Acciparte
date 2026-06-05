import { body } from 'express-validator'

const login = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contrasena es requerida')
]

const register = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Minimo 6 caracteres')
]

const refresh = [
  body('refreshToken').notEmpty().withMessage('El refresh token es requerido')
]

export default { login, register, refresh }
