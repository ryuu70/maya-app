"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface SubscriptionInfo {
  user: {
    id: string
    name: string
    email: string
    isPaid: boolean
    subscriptionPlan: string | null
    subscriptionStatus: string | null
    stripeCustomerId: string | null
    renewalStatus: string
    createdAt: string
  }
  stripeSubscription: {
    id: string
    status: string
    trial_end: number | null
    cancel_at: number | null
    current_period_end: number
    items: {
      data: Array<{
        price: {
          unit_amount: number
          currency: string
        }
      }>
    }
  } | null
  trialEnd: number | null
  cancelAt: number | null
  lastChecked: string
}

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session?.user) {
      router.push("/login")
      return
    }

    // URLパラメータから決済完了を検知
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get("success")
    const sessionId = urlParams.get("session_id")

    if (success === "true" && sessionId) {
      console.log("決済完了を検知:", { success, sessionId })
      handlePaymentSuccess(sessionId)
    } else {
      fetchSubscriptionInfo()
    }
  }, [session, status, router])

  const handlePaymentSuccess = async (sessionId: string) => {
    const userEmail = (session?.user as any)?.email
    if (!userEmail) {
      console.error("ユーザーメールが取得できません")
      return
    }

    console.log("決済完了処理開始:", { sessionId, userEmail })
    setLoading(true)
    try {
      const response = await fetch("/api/payments/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionId,
          userEmail: userEmail,
        }),
      })

      const data = await response.json()
      if (data.success) {
        console.log("✅ 決済完了処理成功:", data.message)
        // URLパラメータをクリア
        window.history.replaceState({}, document.title, window.location.pathname)
        // サブスクリプション情報を再取得
        fetchSubscriptionInfo()
      } else {
        console.error("❌ 決済完了処理失敗:", data.error)
        // エラーの場合も通常の情報取得を実行
        fetchSubscriptionInfo()
      }
    } catch (error) {
      console.error("決済完了処理エラー:", error)
      // エラーの場合も通常の情報取得を実行
      fetchSubscriptionInfo()
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscriptionInfo = async () => {
    const userId = (session?.user as any)?.id
    if (!userId) {
      console.log("セッションまたはユーザーIDがありません:", { session: !!session, userId })
      return
    }

    console.log("サブスクリプション情報取得開始:", { userId })
    setLoading(true)
    try {
      const response = await fetch(`/api/subscriptions/status?userId=${userId}`)
      console.log("APIレスポンス:", { status: response.status, ok: response.ok })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("APIエラー:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("取得したデータ:", data)
      setSubscriptionInfo(data)
    } catch (error) {
      console.error("サブスクリプション情報取得エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async () => {
    const userId = (session?.user as any)?.id
    if (!subscriptionInfo?.stripeSubscription?.id || !userId) return

    if (!confirm("本当にサブスクリプションをキャンセルしますか？\n\nキャンセル後も現在の期間終了まではサービスをご利用いただけます。")) {
      return
    }

    setCanceling(true)
    try {
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          subscriptionId: subscriptionInfo.stripeSubscription.id
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("サブスクリプションが正常にキャンセルされました")
        fetchSubscriptionInfo() // 情報を再取得
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (error) {
      console.error("サブスクリプションキャンセルエラー:", error)
      alert("キャンセルに失敗しました")
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "アクティブ"
      case "canceled": return "キャンセル済み"
      case "trialing": return "トライアル中"
      case "past_due": return "支払い遅延"
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600"
      case "canceled": return "text-red-600"
      case "trialing": return "text-blue-600"
      case "past_due": return "text-yellow-600"
      default: return "text-gray-600"
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            サブスクリプション管理
          </h1>

          {subscriptionInfo ? (
            <div className="space-y-6">
              {/* ユーザー情報 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">ユーザー情報</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">名前:</span>
                    <span className="ml-2 text-gray-900">{subscriptionInfo.user.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">メール:</span>
                    <span className="ml-2 text-gray-900">{subscriptionInfo.user.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">プラン:</span>
                    <span className="ml-2 text-gray-900">{subscriptionInfo.user.subscriptionPlan || "未設定"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">課金状況:</span>
                    <span className={`ml-2 ${subscriptionInfo.user.isPaid ? "text-green-600" : "text-red-600"}`}>
                      {subscriptionInfo.user.isPaid ? "課金中" : "未課金"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stripeサブスクリプション情報 */}
              {subscriptionInfo.stripeSubscription && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Stripeサブスクリプション</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">サブスクリプションID:</span>
                      <span className="text-gray-900 font-mono text-sm">{subscriptionInfo.stripeSubscription.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">状況:</span>
                      <span className={`${getStatusColor(subscriptionInfo.stripeSubscription.status)} font-semibold`}>
                        {getStatusText(subscriptionInfo.stripeSubscription.status)}
                      </span>
                    </div>
                    
                    {/* トライアル期間情報 */}
                    {subscriptionInfo.trialEnd && (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">トライアル終了日:</span>
                        <span className="text-gray-900">{formatDate(subscriptionInfo.trialEnd)}</span>
                      </div>
                    )}

                    {/* 次回請求日 */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">次回請求日:</span>
                      <span className="text-gray-900">{formatDate(subscriptionInfo.stripeSubscription.current_period_end)}</span>
                    </div>

                    {/* キャンセル予定日 */}
                    {subscriptionInfo.cancelAt && (
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">キャンセル予定日:</span>
                        <span className="text-red-600 font-semibold">{formatDate(subscriptionInfo.cancelAt)}</span>
                      </div>
                    )}

                    {/* 金額 */}
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">月額料金:</span>
                      <span className="text-gray-900">
                        ¥{subscriptionInfo.stripeSubscription.items.data[0]?.price.unit_amount / 100}
                      </span>
                    </div>
                  </div>

                  {/* キャンセルボタン */}
                  {subscriptionInfo.stripeSubscription.status === "active" && !subscriptionInfo.cancelAt && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={cancelSubscription}
                        disabled={canceling}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        {canceling ? "キャンセル中..." : "サブスクリプションをキャンセル"}
                      </button>
                      <p className="text-sm text-gray-600 mt-2">
                        ※ キャンセル後も現在の期間終了まではサービスをご利用いただけます
                      </p>
                    </div>
                  )}

                  {/* キャンセル済みの場合 */}
                  {subscriptionInfo.cancelAt && (
                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 font-semibold">
                        このサブスクリプションはキャンセル予定です
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        キャンセル予定日: {formatDate(subscriptionInfo.cancelAt)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* サブスクリプションがない場合 */}
              {!subscriptionInfo.stripeSubscription && (
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">サブスクリプション情報</h2>
                  <p className="text-gray-700 mb-4">
                    現在アクティブなサブスクリプションが見つかりません。
                  </p>
                  <button
                    onClick={() => router.push("/pricing")}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    プランを選択
                  </button>
                </div>
              )}

              {/* 最終更新日 */}
              <div className="text-sm text-gray-500 text-center">
                最終更新: {new Date(subscriptionInfo.lastChecked).toLocaleString("ja-JP")}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">サブスクリプション情報を読み込み中...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 