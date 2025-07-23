'use client'

import dynamic from 'next/dynamic'

// クライアントコンポーネントを動的インポート
const FreeFortune = dynamic(() => import('@/app/components/FreeFortune'), {
  ssr: false,
  loading: () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6"></div>
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
})

export default function FreeFortuneClient() {
  return (
    <FreeFortune onShowLogin={() => {
      // ログインページにリダイレクト
      window.location.href = '/login'
    }} />
  )
} 