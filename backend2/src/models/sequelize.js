import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import loadUserModel from './user.js'
import loadRefreshTokenModel from './refreshToken.js'
import loadSceneModel from './scene.js'

dotenv.config()

const sequelizeConnection = new Sequelize(
  process.env.DATABASE_NAME || 'Acciparte',
  process.env.DATABASE_USERNAME || 'postgres',
  process.env.DATABASE_PASSWORD || 'postgres',
  {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: { connectTimeout: 60000 },
    pool: { max: 5, min: 0, acquire: 60000, idle: 10000 }
  }
)

const User = loadUserModel(sequelizeConnection, Sequelize.DataTypes)
const RefreshToken = loadRefreshTokenModel(sequelizeConnection, Sequelize.DataTypes)
const Scene = loadSceneModel(sequelizeConnection, Sequelize.DataTypes)

const db = { User, RefreshToken, Scene }

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db)
})

async function initSequelize() {
  await sequelizeConnection.authenticate()
  return sequelizeConnection
}

const disconnectSequelize = async (connection) => connection.close()

export { disconnectSequelize, initSequelize, RefreshToken, Scene, sequelizeConnection, User }
