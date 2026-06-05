import client from './client.js'
import { handleError } from './handleError.js'

/**
 * POST /users/login
 * @param {{ email: string, password: string }} credentials
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const login = async (credentials) => {
  try {
    const response = await client.post('/users/login', credentials)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * POST /users/register
 * @param {{ email: string, password: string, tenantId?: number, tenantName?: string }} payload
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const register = async (payload) => {
  try {
    const response = await client.post('/users/register', payload)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * POST /users/refresh
 * @param {{ refreshToken: string }} payload
 * @returns {{ accessToken: string }}
 */
const refresh = async (payload) => {
  try {
    const response = await client.post('/users/refresh', payload)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

/**
 * GET /users/me  (requiere token)
 * @returns {User}
 */
const me = async () => {
  try {
    const response = await client.get('/users/me')
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export default { login, register, refresh, me }
