import { Model } from 'sequelize'

/*
 * Modelo de datos de una escena de accidente.
 *
 * El campo `data` almacena como JSONB el array de elementos visuales:
 * {
 *   elements: [
 *     { id, type, label, x, y, rotation, color, width, height, properties: { notes } }
 *   ]
 * }
 */
const loadSceneModel = (sequelize, DataTypes) => {
  class Scene extends Model {
    static associate(models) {
      Scene.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }

  Scene.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Escena sin titulo'
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { elements: [] }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, { sequelize, modelName: 'Scene' })

  return Scene
}

export default loadSceneModel
