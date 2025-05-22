'use client'

import React from 'react'
import Button from 'react-bootstrap/Button'
import { FaGoogle } from 'react-icons/fa'
import { auth } from '@/app/_config/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

export default function GoogleLoginButton({ onLoginSuccess, disabled }) {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      // 拿到 idToken
      const idToken = await firebaseUser.getIdToken(true)
      onLoginSuccess(idToken) // 只傳 idToken
    } catch (err) {
      console.error('Firebase Google 登入錯誤', err)
      alert('Google 登入失敗：' + err.message)
    }
  }

  return (
    <Button
      variant="outline-dark"
      className="w-100 d-flex align-items-center justify-content-center gap-2"
      onClick={handleGoogleLogin}
      disabled={disabled}
    >
      <FaGoogle />
      <span>使用 Google 帳號登入</span>
    </Button>
  )
}
