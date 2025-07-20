'use client'

import { useState } from 'react'
import { getKinNumber } from '@/app/lib/kin'
import { getEkiDetail } from '@/app/lib/eki'

interface FreeFortuneProps {
  onShowLogin: () => void
}

export default function FreeFortune({ onShowLogin }: FreeFortuneProps) {
  const [birthday, setBirthday] = useState('')
  const [kinNumber, setKinNumber] = useState<number | null>(null)
  const [kinInfo, setKinInfo] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleCalculate = () => {
    if (!birthday) return

    const kin = getKinNumber(birthday)
    if (kin) {
      setKinNumber(kin)
      
      // KIN情報を取得
      const kinData = getEkiDetail(kin)
      setKinInfo(kinData)
    }
  }

  const handleShowDetails = () => {
    setShowDetails(true)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        無料占い - KINナンバー診断
      </h2>
      
      {/* 誕生日入力 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          誕生日を入力してください
        </label>
        <div className="flex gap-4">
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 text-gray-900 placeholder-gray-500 shadow-sm hover:bg-white transition-colors"
          />
          <button
            onClick={handleCalculate}
            disabled={!birthday}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            診断する
          </button>
        </div>
      </div>

      {/* KINナンバー結果 */}
      {kinNumber && kinInfo && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              あなたのKINナンバー
            </h3>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {kinNumber}
            </div>
            <p className="text-gray-600">
              KIN {kinNumber} - {kinInfo.概要}
            </p>
          </div>

          {/* 基本情報 */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              基本情報
            </h4>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">易:</span>
                <span className="ml-2 text-gray-600">{kinInfo.易}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">音:</span>
                <span className="ml-2 text-gray-600">{kinInfo.音}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">紋章:</span>
                <span className="ml-2 text-gray-600">{kinInfo.紋章?.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* 詳細情報（制限付き） */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              詳細情報
            </h4>
            
            {!showDetails ? (
              <div className="text-center">
                <div className="mb-4">
                  <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-500 text-sm">
                      詳細情報は制限されています
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleShowDetails}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  詳細を見る
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* モザイク処理された詳細情報 */}
                <div className="relative">
                  <div className="space-y-3 opacity-30">
                    <div>
                      <span className="font-medium text-gray-700">性格:</span>
                      <span className="ml-2 text-gray-600">
                        あなたは創造的で直感的な性格の持ち主です。芸術的な才能に恵まれ、人々を魅了する力を持っています。
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">運勢:</span>
                      <span className="ml-2 text-gray-600">
                        今年は新しいことに挑戦するのに適した年です。特に創造的な活動で大きな成果を上げることができるでしょう。
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">アドバイス:</span>
                      <span className="ml-2 text-gray-600">
                        直感を信じて行動することが成功の鍵です。周囲の意見に惑わされず、自分の道を進みましょう。
                      </span>
                    </div>
                  </div>
                  
                  {/* モザイクオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/90 rounded-lg"></div>
                  
                  {/* ログイン促進メッセージ */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/95 p-6 rounded-lg shadow-lg text-center max-w-sm">
                      <div className="text-2xl mb-3">🔒</div>
                      <h5 className="text-lg font-semibold text-gray-800 mb-2">
                        詳細情報を見るには
                      </h5>
                      <p className="text-gray-600 mb-4 text-sm">
                        続きを読むには新規登録またはログインが必要です
                      </p>
                      <div className="space-y-2">
                        <button
                          onClick={onShowLogin}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                        >
                          新規登録 / ログイン
                        </button>
                        <button
                          onClick={() => setShowDetails(false)}
                          className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm"
                        >
                          閉じる
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 無料版の制限説明 */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h5 className="font-semibold text-yellow-800 mb-2">
              💡 無料版の制限
            </h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• 詳細な性格分析と運勢予測は制限されています</li>
              <li>• 年齢別運勢や詳細アドバイスは有料会員限定です</li>
              <li>• 新規登録でより詳細な占い結果をお楽しみいただけます</li>
            </ul>
          </div>
        </div>
      )}

      {/* 説明 */}
      {!kinNumber && (
        <div className="text-center text-gray-600">
          <p className="mb-4">
            誕生日を入力して、あなたのKINナンバーを診断しましょう。
          </p>
          <p className="text-sm">
            KINナンバーは1〜260の数字で、あなたの本質的な性格と運命を表します。
          </p>
        </div>
      )}
    </div>
  )
} 