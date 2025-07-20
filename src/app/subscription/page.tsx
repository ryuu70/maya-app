"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface SubscriptionData {
  user: {
    id: string
    name: string
    email: string
    isPaid: boolean
    subscriptionPlan: string
    subscriptionStatus: string
    stripeCustomerId: string
    renewalStatus: string
    createdAt: string
  }
  stripeSubscription: {
    id: string
    status: string
    cancel_at_period_end: boolean
    current_period_end: number
  } | null
  trialEnd: number | null
  cancelAt: number | null
  lastChecked: string
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user?.email) {
      setLoading(false)
      return
    }

    fetchSubscriptionInfo()
  }, [session, status])

  const fetchSubscriptionInfo = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/subscriptions/status?email=${session?.user?.email}`)
      
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      } else {
        console.error("サブスクリプション情報の取得に失敗しました")
      }
    } catch (error) {
      console.error("エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm("本当にサブスクリプションをキャンセルしますか？\n\n現在の期間終了までサービスをご利用いただけます。")) {
      return
    }

    try {
      setCanceling(true)
      setMessage("")

      const response = await fetch(`/api/subscriptions/cancel?email=${session?.user?.email}`, {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("サブスクリプションが正常にキャンセルされました")
        // サブスクリプション情報を再取得
        await fetchSubscriptionInfo()
      } else {
        setMessage(`エラー: ${data.error}`)
      }
    } catch (error) {
      console.error("キャンセルエラー:", error)
      setMessage("サブスクリプションのキャンセルに失敗しました")
    } finally {
      setCanceling(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">ログインが必要です</h1>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            ログイン
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            サブスクリプション管理
          </h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes("エラー") 
                ? "bg-red-100 border border-red-400 text-red-700" 
                : "bg-green-100 border border-green-400 text-green-700"
            }`}>
              {message}
            </div>
          )}

          {subscriptionData ? (
            <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                現在のサブスクリプション
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">ユーザー情報</h3>
                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-medium">名前:</span> {subscriptionData.user.name}</p>
                    <p><span className="font-medium">メール:</span> {subscriptionData.user.email}</p>
                    <p><span className="font-medium">プラン:</span> {subscriptionData.user.subscriptionPlan}</p>
                    <p><span className="font-medium">ステータス:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${
                        subscriptionData.user.subscriptionStatus === 'active' || subscriptionData.user.subscriptionStatus === 'trialing'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {subscriptionData.user.subscriptionStatus === 'trialing' ? 'トライアル中' :
                         subscriptionData.user.subscriptionStatus === 'active' ? 'アクティブ' :
                         subscriptionData.user.subscriptionStatus === 'canceled' ? 'キャンセル済み' :
                         subscriptionData.user.subscriptionStatus}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">サブスクリプション詳細</h3>
                  <div className="space-y-2 text-gray-600">
                    {subscriptionData.stripeSubscription ? (
                      <>
                        <p><span className="font-medium">サブスクリプションID:</span> {subscriptionData.stripeSubscription.id}</p>
                        <p><span className="font-medium">Stripeステータス:</span> {subscriptionData.stripeSubscription.status}</p>
                        {subscriptionData.stripeSubscription.current_period_end && (
                          <p><span className="font-medium">現在の期間終了:</span> {formatDate(subscriptionData.stripeSubscription.current_period_end)}</p>
                        )}
                        {subscriptionData.stripeSubscription.cancel_at_period_end && (
                          <p className="text-red-600 font-medium">期間終了時にキャンセル予定</p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500">Stripeサブスクリプション情報がありません</p>
                    )}
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-4">
                  {subscriptionData.user.subscriptionStatus === 'active' || subscriptionData.user.subscriptionStatus === 'trialing' ? (
                    <>
                      {!subscriptionData.stripeSubscription?.cancel_at_period_end && (
                        <button
                          onClick={handleCancelSubscription}
                          disabled={canceling}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          {canceling ? "キャンセル中..." : "サブスクリプションをキャンセル"}
                        </button>
                      )}
                      <Link
                        href="/dashboard"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        ダッシュボードに戻る
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/pricing"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      プランを再開する
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-xl p-6 text-center">
              <p className="text-gray-600 mb-4">サブスクリプション情報を取得できませんでした</p>
              <Link href="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                プランを確認する
              </Link>
            </div>
          )}

          {/* 注意事項 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">注意事項</h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• サブスクリプションをキャンセルしても、現在の期間終了まではサービスをご利用いただけます</li>
              <li>• 期間終了後は自動的に無料プランに変更されます</li>
              <li>• キャンセル後もいつでも再開できます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 