// museum-backend/src/migrations/YYYYMMDDHHMMSS-create-chat-messages.js
// 聊天訊息的遷移
import { DataTypes } from 'sequelize'

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('chat_messages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Members',
        key: 'id'
      }
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Members',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
    }
  })

  // 添加索引
  await queryInterface.addIndex('chat_messages', ['sender_id'])
  await queryInterface.addIndex('chat_messages', ['receiver_id'])
  await queryInterface.addIndex('chat_messages', ['created_at'])
}

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('chat_messages')
}