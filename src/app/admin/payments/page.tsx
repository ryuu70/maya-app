"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface User {
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

interface StripeSubscription {
  id: string
  status: string
  current_period_end: number
  items: {
    data: Array<{
      price: {
        unit_amount: number
        currency: string
      }
    }>
  }
}

interface PaymentStatus {
  user: User
  stripeSubscription: StripeSubscription | null
  lastChecked: string
}

export default function PaymentsAdminPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchEmail, setSearchEmail] = useState("")
  const [updateForm, setUpdateForm] = useState({
    isPaid: false,
    subscriptionPlan: "",
    subscriptionStatus: "",
    renewalStatus: ""
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("ユーザー取得エラー:", error)
      alert("ユーザー情報の取得に失敗しました")
    }
  }

  const fetchPaymentStatus = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/payments/status?userId=${userId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.user) {
        setPaymentStatus(data)
        setUpdateForm({
          isPaid: data.user.isPaid,
          subscriptionPlan: data.user.subscriptionPlan || "",
          subscriptionStatus: data.user.subscriptionStatus || "",
          renewalStatus: data.user.renewalStatus || ""
        })
      }
    } catch (error) {
      console.error("決済状況取得エラー:", error)
      alert("決済状況の取得に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const response = await fetch("/api/payments/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          ...updateForm
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("決済状況が更新されました")
        fetchPaymentStatus(selectedUser.id)
        fetchUsers() // ユーザーリストも更新
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (error) {
      console.error("決済状況更新エラー:", error)
      alert("更新に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const syncWithStripe = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const response = await fetch("/api/payments/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          syncWithStripe: true
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Stripeと同期して決済状況が更新されました")
        fetchPaymentStatus(selectedUser.id)
        fetchUsers() // ユーザーリストも更新
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (error) {
      console.error("Stripe同期エラー:", error)
      alert("同期に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const searchUser = async () => {
    if (!searchEmail) return

    setLoading(true)
    try {
      const response = await fetch(`/api/payments/status?email=${searchEmail}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.user) {
        setPaymentStatus(data)
        setSelectedUser(data.user)
        setUpdateForm({
          isPaid: data.user.isPaid,
          subscriptionPlan: data.user.subscriptionPlan || "",
          subscriptionStatus: data.user.subscriptionStatus || "",
          renewalStatus: data.user.renewalStatus || ""
        })
      } else {
        alert("ユーザーが見つかりません")
      }
    } catch (error) {
      console.error("ユーザー検索エラー:", error)
      alert("検索に失敗しました")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ja-JP")
  }

  const formatStripeDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("ja-JP")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-600 font-semibold"
      case "canceled": return "text-red-600 font-semibold"
      case "past_due": return "text-yellow-600 font-semibold"
      default: return "text-gray-600 font-semibold"
    }
  }

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">アクセス拒否</h1>
          <p className="text-gray-700">このページにアクセスするにはログインが必要です。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            決済状況管理
          </h1>
          <p className="text-gray-600 text-lg">
            ユーザーの決済状況を確認・管理できます
          </p>
        </div>

        {/* ユーザー検索 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ユーザー検索
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="メールアドレスを入力してください"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={searchUser}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "検索中..." : "検索"}
            </button>
          </div>
        </div>

        {/* 決済状況表示・編集 */}
        {paymentStatus && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              決済状況 - {paymentStatus.user.name}
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* 現在の状況 */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">現在の状況</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">メール:</span>
                    <span className="text-gray-900">{paymentStatus.user.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">課金状況:</span>
                    <span className={getPaymentStatusColor(paymentStatus.user.isPaid)}>
                      {paymentStatus.user.isPaid ? "課金中" : "未課金"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">プラン:</span>
                    <span className="text-gray-900">{paymentStatus.user.subscriptionPlan || "未設定"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">サブスクリプション状況:</span>
                    <span className="text-gray-900">{paymentStatus.user.subscriptionStatus || "未設定"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">継続申請:</span>
                    <span className="text-gray-900">{paymentStatus.user.renewalStatus}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">Stripe顧客ID:</span>
                    <span className="text-gray-900 font-mono text-sm">{paymentStatus.user.stripeCustomerId || "未設定"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-gray-700">最終確認:</span>
                    <span className="text-gray-900">{formatDate(paymentStatus.lastChecked)}</span>
                  </div>
                </div>

                {/* Stripe情報 */}
                {paymentStatus.stripeSubscription && (
                  <div className="mt-6 bg-white rounded-lg border-2 border-gray-200 p-4">
                    <h4 className="font-bold text-gray-900 mb-3">Stripe情報</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 text-sm">サブスクリプションID:</span>
                        <span className="text-gray-900 font-mono text-sm">{paymentStatus.stripeSubscription.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 text-sm">状況:</span>
                        <span className={getStatusColor(paymentStatus.stripeSubscription.status)}>
                          {paymentStatus.stripeSubscription.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 text-sm">次回請求日:</span>
                        <span className="text-gray-900 text-sm">{formatStripeDate(paymentStatus.stripeSubscription.current_period_end)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700 text-sm">金額:</span>
                        <span className="text-gray-900 text-sm">¥{paymentStatus.stripeSubscription.items.data[0]?.price.unit_amount / 100}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 編集フォーム */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">状況を更新</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      課金状況
                    </label>
                    <select
                      value={updateForm.isPaid ? "true" : "false"}
                      onChange={(e) => setUpdateForm({...updateForm, isPaid: e.target.value === "true"})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
                    >
                      <option value="false">未課金</option>
                      <option value="true">課金中</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      プラン
                    </label>
                    <select
                      value={updateForm.subscriptionPlan}
                      onChange={(e) => setUpdateForm({...updateForm, subscriptionPlan: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
                    >
                      <option value="">未設定</option>
                      <option value="BASIC">ベーシック</option>
                      <option value="PREMIUM">プレミアム</option>
                      <option value="PRO">プロ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      サブスクリプション状況
                    </label>
                    <input
                      type="text"
                      value={updateForm.subscriptionStatus}
                      onChange={(e) => setUpdateForm({...updateForm, subscriptionStatus: e.target.value})}
                      placeholder="例: active, canceled"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      継続申請状況
                    </label>
                    <select
                      value={updateForm.renewalStatus}
                      onChange={(e) => setUpdateForm({...updateForm, renewalStatus: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 bg-white"
                    >
                      <option value="NONE">申請なし</option>
                      <option value="REQUESTED">申請中</option>
                      <option value="APPROVED">許可済み</option>
                    </select>
                  </div>

                                      <button
                      onClick={updatePaymentStatus}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      {loading ? "更新中..." : "状況を更新"}
                    </button>
                    
                    <button
                      onClick={syncWithStripe}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                    >
                      {loading ? "同期中..." : "Stripeと同期"}
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ユーザー一覧 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ユーザー一覧 ({users.length}人)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    名前
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    メール
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    課金状況
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    プラン
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    登録日
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b-2 border-gray-200">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200">
                      <span className={getPaymentStatusColor(user.isPaid)}>
                        {user.isPaid ? "課金中" : "未課金"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200">
                      {user.subscriptionPlan || "未設定"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm border-b border-gray-200">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          fetchPaymentStatus(user.id)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 