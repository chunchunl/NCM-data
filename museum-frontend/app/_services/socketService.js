// museum-frontend/app/_services/socketService.js
import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_API_URL, {
        withCredentials: true
      })

      this.socket.on('connect', () => {
        console.log('已連接到 Socket.IO 伺服器')
        this.isConnected = true
      })

      this.socket.on('disconnect', () => {
        console.log('與 Socket.IO 伺服器斷開連接')
        this.isConnected = false
      })
    }
    return this.socket
  }

  register(member_id) {
    if (this.socket) {
      this.socket.emit('register', member_id)
    }
  }

  sendPrivateMessage(sender_id, receiver_id, content) {
    if (this.socket) {
      this.socket.emit('privateMessage', {
        sender_id,
        receiver_id,
        content
      })
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('newMessage', callback)
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('messageSent', callback)
    }
  }

  onMessageError(callback) {
    if (this.socket) {
      this.socket.on('messageError', callback)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }
}

export const socketService = new SocketService()