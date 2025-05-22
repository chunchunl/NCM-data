'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/app/_components/navbar'
// button
import Button from 'react-bootstrap/Button'
// modal
import Modal from 'react-bootstrap/Modal'
// toast
import { useToast } from '@/app/_components/ToastManager'

// form
import Form from 'react-bootstrap/Form'
import { useForm } from 'react-hook-form'
import FloatingField from '@/app/_components/FloatingField'
// import PasswordField from '@/app/_components/PasswordField'
import FormRow from '@/app/_components/FormRow'
// import '@/app/_styles/formCustom'

import '@/app/_styles/globals.scss'
import '@/app/_styles/home.scss'

export default function AppPage(props) {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  // toast
  const { showToast } = useToast()
  const variants = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSubmit = (data) => console.log('🎉', data)

  return (
    <>
    <Navbar />
    <div className="container">
      <div className="grid-container">
        <div className="box box1">
          <div className="ticket-box" />
          <hr className="box1-hr" />

          <div className="box1-content">
            <h1>
              Today
              <img src="./images/1_3.svg" alt="" />
              <br />
              opening hours
            </h1>

            <p>9:00 - 17:00</p>
            <hr />

            <button>
              前往展覽
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>

        <div className="box box2">
          {/* <video src="./images/box-bg3.gif" autoPlay muted loop /> */}
          {/* <img src="./logo/logo-navbar-light-all.svg" alt="" /> */}

          {/* <h1>歡迎光臨</h1>
        <div>
          <div className="logo"></div>
          <h1>國立故瓷博物館</h1>
        </div> */}
        </div>

        <div className="box box3">
          <div className="box3-course">
            <button className="box3-course-content">
              <img src="./images/1_1.svg" alt="" />
              <h1>精選課程</h1>
            </button>
          </div>
        </div>

        <div className="box box4">
          <div className="box4-shop">
            <div className="box4-shop-content">
              <img src="./images/1_2.svg" alt="" />
              <h1>故瓷商城</h1>
              {/* <button>
              前往購物
              <i className="fa-solid fa-arrow-right" />
            </button> */}
            </div>
          </div>
        </div>

        <div className="box box5">
          <h1>你的命定瓷品是？</h1>
          <button>
            立即測驗
            <i className="fa-solid fa-arrow-right" />
          </button>
        </div>
        </div>
      </div>
    </>
  )
}
