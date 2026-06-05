import bcrypt from 'bcryptjs';
import { Model } from "sequelize";
const salt = bcrypt.genSaltSync(5);
const loadUserModel = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Tenant, { foreignKey: 'tenantId', as: 'tenant' })
      User.hasMany(models.Incident, { foreignKey: 'userId', as: 'incidents' })
      User.hasMany(models.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        // Hash the password before saving it to the database
        const hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hashedPassword);
      }
    },
    tenantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Tenants', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
}

export default loadUserModel
