import UserController from '../controllers/UserController.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { handleValidation } from '../validations/HandleValidation.js'
import UserValidation from '../validations/UserValidation.js'

const loadFileRoutes = (app) => {
  app.route('/users/login')
    .post(
      UserValidation.login,
      handleValidation,
      UserController.login
    )

  app.route('/users/register')
    .post(
      UserValidation.register,
      handleValidation,
      UserController.register
    )

  app.route('/users/refresh')
    .post(
      UserValidation.refresh,
      handleValidation,
      UserController.refresh
    )

  app.route('/users/me')
    .get(
      isLoggedIn,
      UserController.me
    )
}

export default loadFileRoutes
