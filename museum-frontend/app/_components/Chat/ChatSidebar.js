'use client'

import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '@/app/_hooks/useAuth'
import { FaTimes, FaPaperPlane, FaImage } from 'react-icons/fa'
import { Offcanvas, Button, Form, InputGroup } from 'react-bootstrap'
import { useToast } from '@/app/_components/ToastManager'
import './chat.scss'

const ChatSidebar = ({ isOpen, onClose, receiverId, isStaff = false }) => {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [onlineMembers, setOnlineMembers] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [retryCount, setRetryCount] = useState(0)
  const [userStatus, setUserStatus] = useState('offline')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [waitingForStaff, setWaitingForStaff] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const typingTimeout = useRef(null)
  const { member, token } = useAuth()
  const { showToast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeSocket = () => {
    if (!member?.id || !token) {
      console.error('缺少必要的認證信息')
      return null
    }

    console.log('初始化 Socket.IO 客戶端...', {
      memberId: member.id,
      token: token ? '存在' : '不存在',
    })
    const backendUrl = 'http://localhost:3005'
    console.log('後端 URL:', backendUrl)

    // 如果已經存在連接，先斷開
    if (socketRef.current) {
      console.log('斷開現有連接')
      socketRef.current.disconnect()
    }

    socketRef.current = io(backendUrl, {
      auth: {
        token: token,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
      withCredentials: true,
    })

    // 連接成功
    socketRef.current.on('connect', () => {
      console.log('Socket.IO 連接成功', {
        socketId: socketRef.current.id,
        memberId: member.id,
      })
      setConnectionStatus('connected')
      setRetryCount(0)

      // 註冊用戶
      socketRef.current.emit('register', {
        name: localStorage.getItem('userName') || '用戶',
      })
    })

    // 連接錯誤
    socketRef.current.on('connect_error', (error) => {
      console.error('Socket.IO 連接錯誤:', error)
      console.error('連接詳情:', {
        url: backendUrl,
        token: token ? '存在' : '不存在',
        error: error.message,
      })
      setConnectionStatus('error')

      if (retryCount < 3) {
        console.log(`嘗試重新連接 (${retryCount + 1}/3)...`)
        setTimeout(() => {
          setRetryCount((prev) => prev + 1)
          initializeSocket()
        }, 2000)
      } else {
        console.error('達到最大重試次數')
        setConnectionStatus('failed')
      }
    })

    // 斷開連接
    socketRef.current.on('disconnect', () => {
      console.log('Socket.IO 斷開連接')
      setConnectionStatus('disconnected')
    })

    // 接收私聊消息
    socketRef.current.on('privateMessage', (message) => {
      try {
        console.log('收到新消息:', message)
        const parsedMessage =
          typeof message === 'string' ? JSON.parse(message) : message
        console.log('解析後的消息:', parsedMessage)
        setMessages((prev) => {
          console.log('更新前的消息列表:', prev)
          const newMessages = [...prev, parsedMessage]
          console.log('更新後的消息列表:', newMessages)
          return newMessages
        })

        // 標記消息為已讀
        if (parsedMessage.sender_id === receiverId) {
          socketRef.current.emit('markAsRead', parsedMessage.id)
        }
      } catch (error) {
        console.error('解析消息錯誤:', error)
      }
    })

    // 錯誤處理
    socketRef.current.on('error', (error) => {
      console.error('Socket 錯誤:', error)
    })

    // 用戶狀態更新
    socketRef.current.on('userStatus', (data) => {
      console.log('用戶狀態更新:', data)
      if (data.userId === member?.id) {
        setUserStatus(data.status)
      }
    })

    // 連接確認
    socketRef.current.on('connectionConfirmed', (data) => {
      console.log('連接確認:', data)
      setUserStatus('online')
    })

    // 在線會員列表更新（僅客服）
    if (isStaff) {
      socketRef.current.on('onlineMembers', (members) => {
        console.log('在線會員列表更新:', members)
        setOnlineMembers(members)
      })
    }

    return () => {
      if (socketRef.current) {
        console.log('清理 Socket.IO 連接...')
        socketRef.current.disconnect()
        setConnectionStatus('disconnected')
      }
    }
  }

  // 監聽組件掛載和必要參數變化
  useEffect(() => {
    console.log('ChatSidebar 參數變化:', {
      isOpen,
      memberId: member?.id,
      hasToken: !!token,
      receiverId,
      isStaff,
    })

    if (isOpen && member?.id && token) {
      console.log('初始化 Socket 連接')
      initializeSocket()
    }

    return () => {
      if (socketRef.current) {
        console.log('組件卸載，斷開 Socket 連接')
        socketRef.current.disconnect()
      }
    }
  }, [isOpen, member?.id, token, receiverId, isStaff])

  const handleImageSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        alert('圖片大小不能超過 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        alert('請選擇圖片文件')
        return
      }
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const sendMessage = () => {
    console.log('開始發送消息，當前狀態:', {
      inputMessage: inputMessage,
      socketRef: socketRef.current ? '已連接' : '未連接',
      receiverId: receiverId,
      connectionStatus: connectionStatus,
      member: member,
      isStaff: isStaff,
      hasImage: !!selectedImage,
    })

    if (
      (!inputMessage.trim() && !selectedImage) ||
      !socketRef.current ||
      !receiverId ||
      connectionStatus !== 'connected'
    ) {
      console.log('無法發送消息，原因:', {
        hasMessage: !!inputMessage.trim(),
        hasImage: !!selectedImage,
        hasSocket: !!socketRef.current,
        hasReceiver: !!receiverId,
        connectionStatus,
      })
      return
    }

    const messageData = {
      content: inputMessage.trim(),
      receiver_id: receiverId,
      image: selectedImage ? imagePreview : null,
    }

    console.log('準備發送消息:', messageData)
    try {
      socketRef.current.emit('privateMessage', messageData, (response) => {
        console.log('消息發送回調:', response)
      })
      console.log('消息已發送')
      setInputMessage('')
      removeImage()
    } catch (error) {
      console.error('發送消息時出錯:', error)
    }
  }

  const handleInputChange = (e) => {
    setInputMessage(e.target.value)
    if (receiverId) {
      socketRef.current?.emit('typing', { to: receiverId })
      clearTimeout(typingTimeout.current)
      typingTimeout.current = setTimeout(() => {
        socketRef.current?.emit('stopTyping', { to: receiverId })
      }, 1500)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      console.log('按下 Enter 鍵，準備發送消息')
      sendMessage()
    }
  }

  // 在組件掛載時檢查初始狀態
  useEffect(() => {
    console.log('ChatSidebar 初始狀態:', {
      isOpen,
      receiverId,
      isStaff,
      member: member?.id,
      connectionStatus,
    })
  }, [isOpen, receiverId, isStaff, member?.id, connectionStatus])

  // 監聽 socket 連接狀態變化
  useEffect(() => {
    if (socketRef.current) {
      console.log('Socket 連接狀態變化:', connectionStatus)
    }
  }, [connectionStatus])

  // 在 socket 連接成功後，如果是會員，發送等待客服消息
  useEffect(() => {
    if (socketRef.current && !isStaff && member?.id) {
      socketRef.current.emit('waitingForStaff', {
        userId: member.id,
        userName: member.name || member.email,
      })
      setWaitingForStaff(true)
    }
  }, [socketRef.current, isStaff, member?.id])

  // 監聽客服上線狀態
  useEffect(() => {
    if (socketRef.current && !isStaff) {
      socketRef.current.on('staffOnline', () => {
        setWaitingForStaff(false)
        showToast('success', '客服已上線')
      })

      socketRef.current.on('staffOffline', () => {
        setWaitingForStaff(true)
        showToast('warning', '客服已離線，請稍後再試')
      })
    }
  }, [socketRef.current, isStaff])

  // 監聽 typing 事件
  useEffect(() => {
    if (!socketRef.current) return
    const handleTyping = () => setOtherTyping(true)
    const handleStopTyping = () => setOtherTyping(false)
    socketRef.current.on('typing', handleTyping)
    socketRef.current.on('stopTyping', handleStopTyping)
    return () => {
      socketRef.current.off('typing', handleTyping)
      socketRef.current.off('stopTyping', handleStopTyping)
    }
  }, [socketRef.current])

  return (
    <Offcanvas
      show={isOpen}
      onHide={onClose}
      placement="end"
      className="chat-sidebar"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {isStaff ? '客服中心' : '與客服聊天'}
          <span className={`status-indicator ${userStatus}`}>
            {userStatus === 'online' ? '在線' : '離線'}
          </span>
          {!isStaff && waitingForStaff && (
            <span className="waiting-status">等待客服連線中...</span>
          )}
          {connectionStatus !== 'connected' && (
            <span className={`connection-status ${connectionStatus}`}>
              {connectionStatus === 'reconnecting' ? (
                '重新連接中...'
              ) : connectionStatus === 'error' ? (
                '連接錯誤'
              ) : connectionStatus === 'failed' ? (
                <Button
                  variant="link"
                  className="p-0 text-danger"
                  onClick={initializeSocket}
                >
                  連接失敗，點擊重試
                </Button>
              ) : (
                '已斷開'
              )}
            </span>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column p-0">
        {!isStaff && waitingForStaff && (
          <div className="waiting-message text-center p-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mb-0">正在等待客服連線，請稍候...</p>
          </div>
        )}

        {isStaff && onlineMembers.length > 0 && (
          <div className="online-members p-2 border-bottom">
            <small className="text-muted">
              在線會員: {onlineMembers.length}
            </small>
          </div>
        )}

        <div className="messages-container flex-grow-1 p-3">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className={`message ${message.sender_id === member?.id ? 'sent' : 'received'}`}
            >
              {message.sender_id !== member?.id && (
                <div className="message-sender">
                  <img
                    src={
                      message.senderType === 'staff'
                        ? '/img/ncmLogo/logo-ncm.png'
                        : '/img/default-avatar.png'
                    }
                    alt="avatar"
                    className="message-avatar"
                  />
                  <span className="message-name">
                    {message.senderType === 'staff' ? '客服' : '會員'}
                  </span>
                </div>
              )}
              <div className="message-bubble">
                {message.image && (
                  <div className="message-image">
                    <img src={message.image} alt="message" />
                  </div>
                )}
                {message.content && (
                  <div className="message-content">{message.content}</div>
                )}
                <div className="message-time">
                  {new Date(message.created_at).toLocaleTimeString()}
                  {message.sender_id === member?.id && (
                    <span className={`message-status ${message.status}`}>
                      {message.status === 'read' ? '已讀' : '已發送'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {otherTyping && (
            <div className="typing-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              對方正在輸入...
            </div>
          )}
        </div>

        <Form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
            if (receiverId) {
              socketRef.current?.emit('stopTyping', { to: receiverId })
            }
          }}
          className="message-input p-3 border-top"
        >
          {imagePreview && (
            <div className="image-preview mb-2">
              <img src={imagePreview} alt="preview" />
              <button
                type="button"
                className="remove-image"
                onClick={removeImage}
              >
                <FaTimes />
              </button>
            </div>
          )}
          <InputGroup>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaImage />
            </Button>
            <Form.Control
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={waitingForStaff ? "等待客服連線中..." : "輸入訊息..."}
              disabled={connectionStatus !== 'connected' || (!isStaff && waitingForStaff)}
            />
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                console.log('發送按鈕點擊')
                sendMessage()
              }}
              disabled={
                (!inputMessage.trim() && !selectedImage) ||
                connectionStatus !== 'connected' ||
                (!isStaff && waitingForStaff)
              }
            >
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Form>
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default ChatSidebar
