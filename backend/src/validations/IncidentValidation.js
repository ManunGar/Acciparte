import { body } from 'express-validator'

const INTERVENTION_TYPES = [
  'Asistencia médica',
  'Unidad de bomberos',
  'Policía',
  'Grúa',
  'Otro'
]

const create = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),

  body('lastName')
    .trim()
    .notEmpty().withMessage('Los apellidos son requeridos')
    .isLength({ max: 150 }).withMessage('Los apellidos no pueden superar los 150 caracteres'),

  body('location')
    .trim()
    .notEmpty().withMessage('El lugar es requerido')
    .isLength({ max: 255 }).withMessage('El lugar no puede superar los 255 caracteres'),

  body('interventionType')
    .notEmpty().withMessage('El tipo de intervención es requerido')
    .isIn(INTERVENTION_TYPES).withMessage(`El tipo de intervención debe ser uno de: ${INTERVENTION_TYPES.join(', ')}`)
]

export default { create, INTERVENTION_TYPES }
