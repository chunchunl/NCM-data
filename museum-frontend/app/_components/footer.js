'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import '@/app/_styles/globals.scss'

export default function Footer(props) {

    const pathname = usePathname()
  
    //管理區不需要選單列
    if (pathname.includes('/admin')) {
      return <></>
    }
  
  return (
    <>
      <div
      
        style={{
          // border: '2px solid red',
          height: 80,
          left: 0,
          bottom: 0,
          position: 'fixed',
          backgroundColor: '#1F1F1F',
          width: '100%',
          color: 'white',
        }}
      >
        <div className="container">
          <div className="row"> 
            <div className="col-12">
              <h1 className="text-center text-white">頁尾</h1>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
