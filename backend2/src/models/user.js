import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';
const salt = bcrypt.genSaltSync(5);

const loadUserModel = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
      User.hasMany(models.Scene, { foreignKey: 'userId', as: 'scenes' })
    }
  }
  User.init({
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, salt));
      }
    }
  }, { sequelize, modelName: 'User' })
  return User
}

export default loadUserModel
