import '@/app/_styles/globals.scss'
import '@/app/_styles/formCustom.scss'
// 導入
// import Navbar from './_components/navbar'
import Footer from './_components/footer'
import { ToastProvider } from '@/app/_components/ToastManager'
import { Inter } from 'next/font/google'
import ChatSidebar from './_components/Chat/ChatSidebar'

// import { AuthProvider } from './_components/Auth/AuthProvider'
// import { AuthProvider } from '@/app/_components/Auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '國立故宮博物院',
  description: '國立故宮博物院官方網站',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        {/* <AuthProvider> */}
        <ToastProvider>
          {/* <Navbar /> */}
          {/* <div style={{ border: '2px solid green', height: '100%' }}> */}
          {children}
          <ChatSidebar />
          {/* </div> */}
          {/* <Footer /> */}
        </ToastProvider>
        {/* </AuthProvider> */}
      </body>
    </html>
  )
}
