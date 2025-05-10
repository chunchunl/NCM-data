'use client'

import React, { createContext, useContext, useState, useCallback } from 'react';
import ThemedToast from './ThemedToast';
import '@/app/_styles/ThemedToast.scss';
import '@/app/_styles/globals.scss';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((variant, message, delay = 5000) => {
    const id = toastIdCounter++;
    const newToast = { id, variant, message, delay };
    setToasts(prev => [newToast, ...prev]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1060 }}>
        {toasts.map(({ id, variant, message, delay }) => (
          <ThemedToast
            key={id}
            variant={variant}
            message={message}
            delay={delay}
            onClose={() => removeToast(id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
