import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3030'

const client = axios.create({ baseURL: BASE_URL })

/* ── Adjunta el access token en cada petición ── */
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const PUBLIC_PATHS = ['/users/login', '/users/register', '/users/refresh']

/* ── Refresca el token automáticamente ante un 401 ── */
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isPublic = PUBLIC_PATHS.some((p) => original.url?.includes(p))
    if (error.response?.status === 401 && !original._retry && !isPublic) {
      original._retry = true
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        // Usamos axios base (no client) para evitar bucle infinito
        const { data } = await axios.post(`${BASE_URL}/users/refresh`, { refreshToken })
        localStorage.setItem('accessToken', data.accessToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return client(original)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default client
