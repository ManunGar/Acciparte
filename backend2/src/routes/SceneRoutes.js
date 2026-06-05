import SceneController from '../controllers/SceneController.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'

const loadFileRoutes = (app) => {
  app.route('/scenes')
    .get(isLoggedIn, SceneController.getAll)
    .post(isLoggedIn, SceneController.create)

  app.route('/scenes/:id')
    .get(isLoggedIn, SceneController.getById)
    .put(isLoggedIn, SceneController.update)
    .delete(isLoggedIn, SceneController.remove)
}

export default loadFileRoutes