// museum-backend/src/models/index.js
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize({
  dialect: 'mysql',
  dialectModule: 'mysql2',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_NAME || 'museum_db',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
})

const models = {}

models.sequelize = sequelize
models.Sequelize = Sequelize

// 導入模型
models.Message = (await import('./message.js')).default(sequelize)
models.Member = (await import('./member.js')).default(sequelize)

// 建立關聯
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models)
  }
})

export default models