import { Sequelize } from 'sequelize';
import { createRequire } from 'module';
import { readdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = require('../config/config.cjs');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const db = {};

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const modelFiles = readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename(__filename) &&
    file !== 'sequelize.js' &&
    file.slice(-3) === '.js' &&
    !file.includes('.test.js')
  );
});

for (const file of modelFiles) {
  const { default: modelDef } = await import(join(__dirname, file));
  const model = modelDef(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize, Sequelize };
export default db;
