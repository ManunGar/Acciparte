import { body } from 'express-validator'

const login = [
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
]

const register = [
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('tenantId')
    .optional()
    .isInt({ min: 1 }).withMessage('tenantId debe ser un entero positivo'),
  body('tenantName')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
]

const refresh = [
  body('refreshToken')
    .notEmpty().withMessage('El refresh token es requerido')
]

export default { login, register, refresh }
