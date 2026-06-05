import IncidentValidation from '../validations/IncidentValidation.js'

/**
 * GET /config/intervention-types
 * Catálogo público de tipos de intervención para el Paso 2 del formulario.
 * No requiere autenticación.
 */
const loadFileRoutes = (app) => {
  app.get('/config/intervention-types', (req, res) => {
    const types = IncidentValidation.INTERVENTION_TYPES.map(value => ({
      value,
      label: value
    }))
    res.json(types)
  })
}

export default loadFileRoutes
