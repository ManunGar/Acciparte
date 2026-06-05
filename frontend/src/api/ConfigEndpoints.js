import client from './client.js'
import { handleError } from './handleError.js'

/**
 * GET /config/intervention-types
 * Catálogo de tipos de intervención para el Paso 2 del formulario.
 * @returns {{ value: string, label: string }[]}
 */
const getInterventionTypes = async () => {
  try {
    const response = await client.get('/config/intervention-types')
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export default { getInterventionTypes }
