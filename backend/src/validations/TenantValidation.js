import { body, param } from 'express-validator'

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo')

const update = [
  idParam,
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('slug')
    .optional()
    .matches(/^[a-z0-9-]+$/).withMessage('El slug solo puede contener letras minúsculas, números y guiones')
    .isLength({ min: 2, max: 60 }).withMessage('El slug debe tener entre 2 y 60 caracteres')
]

export default { update }
