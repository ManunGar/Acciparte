import client from './client.js'
import { handleError } from './handleError.js'

/**
 * GET /tenants
 * @returns {Tenant[]}
 */
const getAll = async () => {
  try {
    const response = await client.get('/tenants')
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export default { getAll }
