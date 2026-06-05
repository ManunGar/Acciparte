import TenantController from '../controllers/TenantController.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../validations/HandleValidation.js'
import TenantValidation from '../validations/TenantValidation.js'

const loadFileRoutes = (app) => {
  // Pública: necesaria para el dropdown de registro
  app.route('/tenants')
    .get(TenantController.getAll)

  app.route('/tenants/:id')
    .get(
      isLoggedIn,
      TenantController.getById
    )
    .put(
      isLoggedIn,
      TenantValidation.update,
      handleValidation,
      TenantController.update
    )

  app.route('/tenants/:id/users')
    .get(
      isLoggedIn,
      TenantController.getUsers
    )
}

export default loadFileRoutes
