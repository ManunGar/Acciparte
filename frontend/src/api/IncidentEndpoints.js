import client from './client.js'
import { handleError } from './handleError.js'

/**
 * GET /incidents
 * Devuelve todas las incidencias del tenant del usuario autenticado.
 * @returns {Incident[]}
 */
const getAll = async () => {
  try {
    const response = await client.get('/incidents')
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * GET /incidents/:id
 * @param {string|number} id
 * @returns {Incident}
 */
const getById = async (id) => {
  try {
    const response = await client.get(`/incidents/${id}`)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * POST /incidents
 * @param {{ firstName: string, lastName: string, location: string, interventionType: string }} data
 * @returns {Incident}
 */
const create = async (data) => {
  try {
    const response = await client.post('/incidents', data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * DELETE /incidents/:id
 * @param {string|number} id
 * @returns {void}
 */
const remove = async (id) => {
  try {
    await client.delete(`/incidents/${id}`)
  } catch (error) {
    handleError(error)
  }
}

export default { getAll, getById, create, remove }
