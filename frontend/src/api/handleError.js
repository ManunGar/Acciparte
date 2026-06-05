/**
 * ApiError — error tipado que lanzan todos los endpoints.
 *
 * Propiedades:
 *   message  — texto legible para mostrar al usuario
 *   status   — código HTTP recibido
 *   path     — campo que causó el error (solo en errores de validación 422)
 *   code     — código interno devuelto por la API (p.ej. "NOT_FOUND")
 */
class ApiError extends Error {
  constructor(status, message, path, code) {
    super(message)
    this.name    = 'ApiError'
    this.status  = status
    this.path    = path   ?? null
    this.code    = code   ?? null
  }
}

/**
 * handleError — convierte un error de axios en un ApiError y lo lanza.
 *
 * Formatos de respuesta soportados:
 *   422  { errors: [{ msg, path }] }   ← express-validator (handleValidation)
 *   4xx  { error: "...", code: "..." } ← errores controlados del backend
 *   4xx  { message: "..." }            ← errores legacy / passport
 */
function handleError(error) {
  const response = error.response
  const status   = response?.status ?? 0

  let message, path, code

  if (status === 422 && Array.isArray(response?.data?.errors)) {
    // Errores de validación de express-validator
    const first = response.data.errors[0] ?? {}
    message = first.msg  ?? 'Error de validación'
    path    = first.path ?? undefined
    code    = 'VALIDATION_ERROR'
  } else {
    // Resto de errores controlados del backend
    message = response?.data?.error
           ?? response?.data?.message
           ?? error.message
           ?? 'Error desconocido'
    code = response?.data?.code ?? undefined
  }

  throw new ApiError(status, message, path, code)
}

export { ApiError, handleError }
