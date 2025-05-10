export default function AdminLayout({ children }) {
  return (
    <>
      <div
        style={{
          width: 160,
          border: '2px solid yellow',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1,
          overflowX: 'hidden',
        }}
      >
        側邊列
      </div>
      <main
        style={{
          marginLeft: 160,
          border: '5px solid blue',
          height: '100vh',
          backgroundColor: '#ccc',
        }}
      >
        {children}
      </main>
    </>
  )
}
