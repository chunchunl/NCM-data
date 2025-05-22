// 'use client'

// import React, { useState } from 'react'
// import ChatSidebar from './ChatSidebar'
// import ChatList from './ChatList' // 你等一下可以串這個元件
// import { useAuth } from '@/app/_hooks/useAuth'

// export default function ChatManager() {
//   const { member } = useAuth()
//   const [isChatOpen, setIsChatOpen] = useState(false)
//   const [selectedUserId, setSelectedUserId] = useState(null)

//   // 處理選取某個聊天對象
//   const handleSelectUser = (userId) => {
//     console.log('選擇聊天對象:', userId)
//     setSelectedUserId(userId)
//     setIsChatOpen(true)
//   }

//   // 判斷是否為客服
//   const isStaff = member?.role === 'staff'

//   return (
//     <div className="chat-manager d-flex" style={{ height: '100vh' }}>
//       {/* 左側：僅客服顯示清單 */}
//       {isStaff && (
//         <div className="chat-list-panel border-end" style={{ width: '300px', overflowY: 'auto' }}>
//           <ChatList currentUserId={member?.id} onSelectUser={handleSelectUser} />
//         </div>
//       )}

//       {/* 右側：聊天區塊 */}
//       <div className="chat-content-panel flex-grow-1">
//         <ChatSidebar
//           isOpen={isChatOpen}
//           onClose={() => setIsChatOpen(false)}
//           receiverId={selectedUserId}
//           isStaff={isStaff}
//         />
//       </div>
//     </div>
//   )
// }
