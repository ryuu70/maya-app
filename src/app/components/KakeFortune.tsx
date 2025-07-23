"use client"

import { useState } from 'react'
import { getKakeByKin } from '../lib/kake'

interface KakeFortuneProps {
  kinNumber: number
}

export default function KakeFortune({ kinNumber }: KakeFortuneProps) {
  const [activeTab, setActiveTab] = useState<string>('運勢')
  
  const kake = getKakeByKin(kinNumber)
  
  if (!kake) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">
          KIN {kinNumber} に対応する卦が見つかりませんでした。
        </p>
      </div>
    )
  }

  const tabs = [
    { id: '運勢', label: '運勢' },
    { id: '交渉・商取引', label: '交渉・商取引' },
    { id: '愛情・結婚', label: '愛情・結婚' },
    { id: '病気', label: '病気' },
    { id: '失せ物', label: '失せ物' },
    { id: '人物', label: '人物' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 卦の基本情報 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {kake.卦} (第{kake.No}卦)
        </h2>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">KINナンバー:</span> {kake.KIN.join(', ')}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">卦の象:</span> {kake.詳細.卦の象}
        </p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="min-h-[200px]">
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {activeTab}
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {kake.詳細.占いの目安[activeTab as keyof typeof kake.詳細.占いの目安]}
          </div>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          ※ この占いは易経に基づく参考情報です。人生の重要な決断は慎重に行ってください。
        </p>
      </div>
    </div>
  )
} 