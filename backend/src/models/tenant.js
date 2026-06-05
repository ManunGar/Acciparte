import { Model } from 'sequelize'

const loadTenantModel = (sequelize, DataTypes) => {
  class Tenant extends Model {
    static associate(models) {
      Tenant.hasMany(models.User, { foreignKey: 'tenantId', as: 'users' })
      Tenant.hasMany(models.Incident, { foreignKey: 'tenantId', as: 'incidents' })
    }
  }
  Tenant.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Tenant'
  })
  return Tenant
}

export default loadTenantModel
