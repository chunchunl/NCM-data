// museum-backend/src/models/message.js
// 這個檔案是負責處理訊息的模型
import { DataTypes } from 'sequelize'

export default (sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    from_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id'
      }
    },
    to_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'members',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    createdAt: 'timestamp',
    updatedAt: false
  })

  Message.associate = (models) => {
    Message.belongsTo(models.Member, {
      foreignKey: 'from_user_id',
      as: 'sender'
    })
    Message.belongsTo(models.Member, {
      foreignKey: 'to_user_id',
      as: 'receiver'
    })
  }

  return Message
}