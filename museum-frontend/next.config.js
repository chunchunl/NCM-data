/** @type {import('next').NextConfig} */
const nextConfig = {
  // 關閉React Strict Mode工具(避免useEffect執行兩次)
  reactStrictMode: false,
  // eslint設定
  eslint: {
    // 警告: 開啟以下的設定將會忽略所有在build時的eslint錯誤與警告，不建議在部署時直接使用，或請先自行修正eslint相關錯誤與警告
    ignoreDuringBuilds: true,
  },
  // sass設定，修正新版本sass導致的過多棄用警告訊息
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },

  // devIndicators: false,
  //------------> devIndicators: false <-----------------
  //---------!!!!!關閉 Dev Tools 按鈕!!!!-----------------
  //---------!!!!!關閉 Dev Tools 按鈕!!!!-----------------
  //---------!!!!!關閉 Dev Tools 按鈕!!!!-----------------
  //---------------怕有人找不到講三次----------------------
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  // output: 'export', // 導出靜態頁面(SPA) 無法使用`next start`或 api路由
  // distDir: 'dist', // 導出路徑
  // 以下為使用proxy來避免cors
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://localhost:3005/:path*', // 代理Proxy到其它伺服器
  //     },
  //   ]
  // },
  async headers() {
    return [
      {
        source: '/models/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
