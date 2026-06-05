import { Model } from 'sequelize'

const loadIncidentModel = (sequelize, DataTypes) => {
  class Incident extends Model {
    static associate(models) {
      Incident.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Incident.belongsTo(models.Tenant, { foreignKey: 'tenantId', as: 'tenant' })
    }
  }
  Incident.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    interventionType: {
      type: DataTypes.ENUM('Asistencia médica', 'Unidad de bomberos', 'Policía', 'Grúa', 'Otro'),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
    modelName: 'Incident'
  })
  return Incident
}

export default loadIncidentModel
