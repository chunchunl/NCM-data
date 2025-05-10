'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/app/_components/ToastManager';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      showToast('error', decodeURIComponent(error));
      router.push('/');
      return;
    }

    if (token && userData) {
      try {
        // 儲存 token 和用戶資料
        localStorage.setItem('token', token);
        localStorage.setItem('member', userData);
        
        // showToast('success', '登入成功 🎉');
        
        // 重定向到首頁
        router.push('/');
      } catch (err) {
        console.error('處理登入資料時發生錯誤:', err);
        showToast('error', '登入處理失敗，請稍後再試');
        router.push('/');
      }
    } else {
      showToast('error', '登入失敗，請稍後再試');
      router.push('/');
    }
  }, [searchParams, router, showToast]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">載入中...</span>
      </div>
    </div>
  );
} 