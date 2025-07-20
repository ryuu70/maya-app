import FreeFortuneClient from './FreeFortuneClient'

export default function FreeFortunePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            無料占い - マヤ暦KINナンバー診断
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            誕生日を入力して、あなたのKINナンバーを診断しましょう。
            基本情報は無料でご覧いただけます。
          </p>
        </div>
        
        <FreeFortuneClient />
        
        <div className="mt-12 text-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              無料版と有料版の違い
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">✅ 無料版でできること</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• KINナンバーの計算</li>
                  <li>• 基本情報の表示（易、音、紋章）</li>
                  <li>• 概要の確認</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-600 mb-2">🔒 有料版でできること</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 詳細な性格分析</li>
                  <li>• 年齢別運勢予測</li>
                  <li>• 詳細なアドバイス</li>
                  <li>• 著名人との比較</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-4">
                より詳細な占い結果をお楽しみいただくには、新規登録またはログインが必要です。
              </p>
              <div className="space-x-4">
                <a
                  href="/register"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 text-sm"
                >
                  新規登録
                </a>
                <a
                  href="/login"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  ログイン
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 