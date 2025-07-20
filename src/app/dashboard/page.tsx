"use client"

import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import Link from "next/link"

function DashboardContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("loading")

  const isSuccess = searchParams.get("success") === "true"

  useEffect(() => {
    // サブスクリプション状態を確認
    if (session?.user) {
      // ここで実際のサブスクリプション状態を取得
      setSubscriptionStatus("active")
    }
  }, [session])

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">アクセス拒否</h1>
          <p className="mb-4">このページにアクセスするにはログインが必要です。</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            ログイン
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 成功メッセージ */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold text-green-800">
                決済が完了しました！
              </h2>
            </div>
            <p className="text-green-700 mt-2">
              ご登録ありがとうございます。プレミアム機能をご利用いただけます。
            </p>
          </div>
        )}

        {/* ダッシュボードコンテンツ */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            ダッシュボード
          </h1>

          {/* ユーザー情報 */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              アカウント情報
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  お名前
                </label>
                <p className="text-gray-900">{session.user.name || "未設定"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <p className="text-gray-900">{session.user.email}</p>
              </div>
            </div>
          </div>

          {/* サブスクリプション情報 */}
          <div className="mb-8 p-6 bg-purple-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              サブスクリプション
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700">
                  ステータス:{" "}
                  <span className="font-semibold text-green-600">
                    {subscriptionStatus === "active" ? "アクティブ" : "無効"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  プレミアム機能をご利用いただけます
                </p>
              </div>
              <div className="text-right">
                <Link
                  href="/pricing"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  プラン変更
                </Link>
              </div>
            </div>
          </div>

          {/* 機能へのアクセス */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              利用可能な機能
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/"
                className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold mb-2">マヤ暦占い</h3>
                <p className="text-purple-100">
                  あなたのKINと運勢を詳しく分析
                </p>
              </Link>
              <Link
                href="/tarot"
                className="p-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
              >
                <h3 className="text-lg font-semibold mb-2">タロット占い</h3>
                <p className="text-indigo-100">
                  カードを引いて未来を占う
                </p>
              </Link>
            </div>
          </div>

          {/* アクション */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              占いを始める
            </Link>
            <Link
              href="/subscription"
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              サブスクリプション管理
            </Link>
            <Link
              href="/admin"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              管理画面
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
} 