"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface Price {
  id: string
  nickname: string | null
  unit_amount: number | null
  currency: string
  recurring: {
    interval: string
  } | null
  product: {
    name: string
    description: string | null
  }
  created: number
}

export default function StripeAdminPage() {
  const { data: session } = useSession()
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newPrice, setNewPrice] = useState({
    name: "",
    amount: "",
    currency: "jpy",
    interval: "month"
  })

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const response = await fetch("/api/stripe/prices")
      const data = await response.json()
      if (data.prices) {
        setPrices(data.prices)
      }
    } catch (error) {
      console.error("価格取得エラー:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPrice = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)

    try {
      const response = await fetch("/api/stripe/prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPrice.name,
          amount: parseInt(newPrice.amount),
          currency: newPrice.currency,
          interval: newPrice.interval,
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("価格が作成されました！")
        setNewPrice({ name: "", amount: "", currency: "jpy", interval: "month" })
        fetchPrices()
      } else {
        alert(`エラー: ${data.error}`)
      }
    } catch (error) {
      console.error("価格作成エラー:", error)
      alert("価格の作成に失敗しました")
    } finally {
      setCreating(false)
    }
  }

  const formatAmount = (amount: number | null, currency: string) => {
    if (!amount) return "N/A"
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("ja-JP")
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">アクセス拒否</h1>
          <p>このページにアクセスするにはログインが必要です。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Stripe管理
          </h1>

          {/* 新しい価格作成フォーム */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">新しい価格を作成</h2>
            <form onSubmit={createPrice} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    商品名
                  </label>
                  <input
                    type="text"
                    value={newPrice.name}
                    onChange={(e) => setNewPrice({ ...newPrice, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="例: ベーシックプラン"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    価格（円）
                  </label>
                  <input
                    type="number"
                    value={newPrice.amount}
                    onChange={(e) => setNewPrice({ ...newPrice, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="例: 660"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    通貨
                  </label>
                  <select
                    value={newPrice.currency}
                    onChange={(e) => setNewPrice({ ...newPrice, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="jpy">JPY (円)</option>
                    <option value="usd">USD (ドル)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    請求間隔
                  </label>
                  <select
                    value={newPrice.interval}
                    onChange={(e) => setNewPrice({ ...newPrice, interval: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="month">月額</option>
                    <option value="year">年額</option>
                    <option value="week">週額</option>
                    <option value="day">日額</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? "作成中..." : "価格を作成"}
              </button>
            </form>
          </div>

          {/* 既存の価格一覧 */}
          <div>
            <h2 className="text-xl font-semibold mb-4">既存の価格一覧</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">読み込み中...</p>
              </div>
            ) : prices.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                価格が登録されていません
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        Price ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        商品名
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        価格
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        間隔
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
                        作成日
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((price) => (
                      <tr key={price.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 border-b font-mono">
                          {price.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                          {price.product.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                          {formatAmount(price.unit_amount, price.currency)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                          {price.recurring?.interval || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-b">
                          {formatDate(price.created)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 