import { Model } from 'sequelize'

const loadRefreshTokenModel = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }
  RefreshToken.init({
    token: { type: DataTypes.STRING(512), allowNull: false, unique: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    expiresAt: { type: DataTypes.DATE, allowNull: false }
  }, { sequelize, modelName: 'RefreshToken' })
  return RefreshToken
}

export default loadRefreshTokenModel