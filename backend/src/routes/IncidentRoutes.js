import IncidentController from '../controllers/IncidentController.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../validations/HandleValidation.js'
import IncidentValidation from '../validations/IncidentValidation.js'

const loadFileRoutes = (app) => {
  // GET /incidents — lista del tenant
  app.route('/incidents')
    .get(
      isLoggedIn,
      IncidentController.getAll
    )
    // POST /incidents — crear incidencia (formulario en dos pasos, envío único)
    .post(
      isLoggedIn,
      IncidentValidation.create,
      handleValidation,
      IncidentController.create
    )

  // GET /incidents/:id — detalle
  // DELETE /incidents/:id — eliminar
  app.route('/incidents/:id')
    .get(
      isLoggedIn,
      IncidentController.getById
    )
    .delete(
      isLoggedIn,
      IncidentController.remove
    )
}

export default loadFileRoutes
