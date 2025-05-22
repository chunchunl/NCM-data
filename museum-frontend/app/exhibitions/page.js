'use client'

import Carousel from './_components/carousel'
import Menu from './_components/menu'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ExhibitionList from './_components/list'
import Tabs from './_components/tabs' // 若你有 tab 切換功能
import styles from '../exhibitions/_styles/ex-page.module.scss'

export default function ExhibitionPage() {
  const searchParams = useSearchParams()
  const state = searchParams.get('state') || 'current'
  const year = searchParams.get('year') || ''

  // 對過去展覽篩選年份
  const [selectedYear, setSelectedYear] = useState(year)

  useEffect(() => {
    setSelectedYear(year)
  }, [year])

  return (
    <>
      <main className="container">
        <div className={styles.customMargin}>
          <div className="d-flex justify-content-center align-items-center flex-column fw-bold">
            <h3 className="mb-0 pb-0 fw-bold" style={{ letterSpacing: '5px' }}>
           展覽
          </h3>
          <h6 className="mt-2 pt-0 m-0 fw-bold">Exhibition</h6>
          </div>

          <Tabs />
        </div>
        <div>
          {/* 當期展覽專屬：輪播區塊 */}
          {state === 'current' && (
            <section className="my-4 d-flex justify-content-center">
              <Carousel />
            </section>
          )}

          {/* 過去展覽專屬：年份篩選 */}
          {state === 'past' && (
            <section className="my-3">
              <Menu selectedYear={year} />
            </section>
          )}

          <ExhibitionList
            state={state}
            year={state === 'past' ? selectedYear : ''}
          />
        </div>
      </main>
    </>
  )
}
