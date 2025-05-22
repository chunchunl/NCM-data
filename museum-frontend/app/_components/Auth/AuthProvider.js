// 'use client'

// // app/_components/Auth/AuthProvider.jsx
// import React, { createContext, useContext } from 'react'
// import useAuthInner from '@/app/_hooks/useAuth'

// // 1. 建立 Context
// const AuthContext = createContext(null)

// // 2. 提供者元件，必須包在 app/layout.jsx
// export function AuthProvider({ children }) {
//   const auth = useAuthInner()
//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
// }

// // 3. 子元件呼叫的 Hook
// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth 必須在 AuthProvider 裡使用')
//   }
//   return context
// }
