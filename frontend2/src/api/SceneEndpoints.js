import client from './client.js'
import { handleError } from './handleError.js'

/**
 * GET /scenes
 * @returns {Scene[]}
 */
const getAll = async () => {
  try {
    const response = await client.get('/scenes')
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * GET /scenes/:id
 * @param {string|number} id
 * @returns {Scene}
 */
const getById = async (id) => {
  try {
    const response = await client.get(`/scenes/${id}`)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * POST /scenes
 * @param {object} data
 * @returns {Scene}
 */
const create = async (data) => {
  try {
    const response = await client.post('/scenes', data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * PUT /scenes/:id
 * @param {string|number} id
 * @param {object} data
 * @returns {Scene}
 */
const update = async (id, data) => {
  try {
    const response = await client.put(`/scenes/${id}`, data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * DELETE /scenes/:id
 * @param {string|number} id
 * @returns {void}
 */
const remove = async (id) => {
  try {
    await client.delete(`/scenes/${id}`)
  } catch (error) {
    handleError(error)
  }
}

const SceneEndpoints = { getAll, getById, create, update, remove }
export default SceneEndpoints
