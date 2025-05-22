'use client'

import React, { useState, useEffect } from 'react'
import CouTab from './_components/cou-tab.js'
// import DiceCouponGame from './game.js'
import CouponRulesModal from './_components/couponRulesModal.js'

export default function CouponPage() {
  return (
    <>
      <CouponRulesModal />
      <div className="container">
        <div
          className="d-flex justify-content-center align-items-center flex-column"
          style={{ marginTop: '80px' }}
        >
          <h3 className="mb-0 pb-0 fw-bold" style={{ letterSpacing: '2px' }}>
            優惠券領取專區
          </h3>
          <h6 className="mt-2 pt-0 m-0 fw-bold">Coupon Redemption Area</h6>
        </div>

        <CouTab />
        <div className="container">玩遊戲領優惠券</div>
        {/* <DiceCouponGame /> */}
        <></>
      </div>
    </>
  )
}
