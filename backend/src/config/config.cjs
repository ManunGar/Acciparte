require('dotenv').config()
module.exports = {
  development: {
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME || 'Acciparte',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    appPort: process.env.APP_PORT || 3030,
    dialect: 'postgres',
    dialectOptions: {
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME || 'Acciparte',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME || 'Acciparte',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: {
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
}
