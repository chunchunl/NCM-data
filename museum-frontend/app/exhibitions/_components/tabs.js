'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from '../_styles/ex-page.module.scss'

export default function Tabs() {
  // const pathname = usePathname()
  const searchParams = useSearchParams()
  const state = searchParams.get('state') || 'current'

  return (
    <ul className={`${styles.tabs} ${styles['tab-menu']} mt-5`}>
      <li>
        <Link 
          href="/exhibitions"
          className={`${styles.tabItem} ${state === 'current' ? styles.active : ''}`}
        >
          當期展覽
        </Link>
      </li> 
      <li>
        <Link
          href="/exhibitions?state=future"
          className={`${styles.tabItem} ${state === 'future' ? styles.active : ''}`}
        >
          展覽預告
        </Link>
      </li>
      <li>
        <Link
          href="/exhibitions?state=past"
          className={`${styles.tabItem} ${state === 'past' ? styles.active : ''}`}
        >
          展覽回顧
        </Link>
      </li>
    </ul>
  )
}
