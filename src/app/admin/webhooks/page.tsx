"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface WebhookLog {
  id: string
  timestamp: string
  event_type: string
  status: string
  details: string
}

export default function WebhookAdminPage() {
  const { data: session } = useSession()
  const [webhookStatus, setWebhookStatus] = useState<string>("checking")
  const [, setLogs] = useState<WebhookLog[]>([])
  const [testResult, setTestResult] = useState<string>("")
  const [selectedEventType, setSelectedEventType] = useState<string>("checkout.session.completed")
  const [testEmail, setTestEmail] = useState<string>("")
  const [testSessionId, setTestSessionId] = useState<string>("")

  useEffect(() => {
    checkWebhookStatus()
  }, [])

  const checkWebhookStatus = async () => {
    try {
      const response = await fetch("/api/webhooks/test")
      await response.json()
      setWebhookStatus("active")
    } catch {
      setWebhookStatus("error")
    }
  }

  const testWebhook = async () => {
    if (!testEmail) {
      setTestResult("❌ テスト用メールアドレスを入力してください")
      return
    }

    setTestResult("テスト中...")
    try {
      if (selectedEventType === "payment.complete") {
        // 決済完了の手動テスト
        if (!testSessionId) {
          setTestResult("❌ セッションIDを入力してください")
          return
        }
        
        const response = await fetch("/api/payments/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: testSessionId,
            userEmail: testEmail,
          }),
        })

        const result = await response.json()
        if (result.success) {
          setTestResult(`✅ ${result.message}`)
          setLogs(prev => [{
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            event_type: selectedEventType,
            status: "success",
            details: result.message
          }, ...prev])
        } else {
          setTestResult(`❌ テスト失敗: ${result.error}`)
        }
      } else {
        // 通常のwebhookテスト
        const response = await fetch("/api/webhooks/test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventType: selectedEventType,
            customerEmail: testEmail,
            customerId: "cus_test_" + Date.now(),
            subscriptionId: "sub_test_" + Date.now(),
          }),
        })

        const result = await response.json()
        if (result.success) {
          setTestResult(`✅ ${result.message}`)
          setLogs(prev => [{
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            event_type: selectedEventType,
            status: "success",
            details: result.message
          }, ...prev])
        } else {
          setTestResult(`❌ テスト失敗: ${result.error}`)
        }
      }
    } catch {
      setTestResult("❌ Webhookテストエラー")
    }
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Webhook管理
          </h1>

          {/* Webhook状態 */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Webhook状態
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  webhookStatus === "active" ? "bg-green-500" : 
                  webhookStatus === "error" ? "bg-red-500" : "bg-yellow-500"
                }`}></div>
                <span className="text-gray-700">
                  ステータス: {
                    webhookStatus === "active" ? "アクティブ" :
                    webhookStatus === "error" ? "エラー" : "チェック中"
                  }
                </span>
              </div>
              <button
                onClick={checkWebhookStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                再確認
              </button>
            </div>
          </div>

          {/* テスト機能 */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Webhookテスト
            </h2>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">テスト手順</h3>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>1. <strong>Webhookテスト</strong>: 手動でwebhookイベントをシミュレート</p>
                <p>2. <strong>決済完了テスト</strong>: 実際のStripeセッションIDを使用してテスト</p>
                <p>3. <strong>実際の決済</strong>: プライシングページから実際に決済を実行</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  テスト用メールアドレス:
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="実際のユーザーメールアドレスを入力"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                />
              </div>
              {selectedEventType === "payment.complete" && (
                <>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">
                      セッションID:
                    </label>
                    <input
                      type="text"
                      value={testSessionId}
                      onChange={(e) => setTestSessionId(e.target.value)}
                      placeholder="実際のStripeセッションIDを入力"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                    />
                  </div>
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <p><strong>セッションIDの取得方法:</strong></p>
                    <p>1. プライシングページで決済を実行</p>
                    <p>2. 決済完了後のURLから <code>session_id=cs_test_xxx</code> をコピー</p>
                    <p>3. または、Stripeダッシュボードの「決済」→「チェックアウトセッション」で確認</p>
                  </div>
                </>
              )}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  イベントタイプ:
                </label>
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="checkout.session.completed">決済完了</option>
                  <option value="customer.subscription.created">サブスクリプション作成</option>
                  <option value="invoice.payment_succeeded">支払い成功</option>
                  <option value="payment.complete">決済完了（手動）</option>
                </select>
                <button
                  onClick={testWebhook}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  手動テスト実行
                </button>
              </div>
              

              {testResult && (
                <div className="p-4 bg-white rounded-lg border">
                  <p className="text-gray-900 font-semibold">{testResult}</p>
                </div>
              )}
            </div>
          </div>

          {/* Webhook設定情報 */}
          <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Webhook設定
            </h2>
            <div className="space-y-2 text-sm text-gray-900">
              <p><strong>エンドポイントURL:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-gray-900">https://yourdomain.com/api/webhooks/stripe</code></p>
              <p><strong>テストエンドポイント:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-gray-900">https://yourdomain.com/api/webhooks/test</code></p>
              <p><strong>必要なイベント:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-900">
                <li><code className="text-gray-900">checkout.session.completed</code> - 決済完了</li>
                <li><code className="text-gray-900">customer.subscription.created</code> - サブスクリプション作成</li>
                <li><code className="text-gray-900">customer.subscription.updated</code> - サブスクリプション更新</li>
                <li><code className="text-gray-900">customer.subscription.deleted</code> - サブスクリプション削除</li>
              </ul>
            </div>
          </div>

          {/* 実際の決済フローテスト */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              実際の決済フローテスト
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-green-800">1. 決済実行</h3>
                <p className="text-green-700">プライシングページ（<a href="/pricing" className="underline">/pricing</a>）で実際に決済を実行してください。</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">2. セッションID取得</h3>
                <p className="text-green-700">決済完了後のURLから <code className="bg-green-100 px-1 rounded">session_id=cs_test_xxx</code> をコピーしてください。</p>
              </div>
              <div>
                <h3 className="font-semibold text-green-800">3. テスト実行</h3>
                <p className="text-green-700">上記の「決済完了（手動）」テストで、コピーしたセッションIDを使用してテストしてください。</p>
              </div>
            </div>
          </div>

          {/* Stripe CLI コマンド */}
          <div className="mb-8 p-6 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Stripe CLI コマンド
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 mb-2">ローカルでwebhookをテストする場合:</p>
              <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div># Stripe CLIでログイン</div>
                <div>stripe login</div>
                <br />
                <div># Webhookをローカルにフォワード</div>
                <div>stripe listen --forward-to localhost:3000/api/webhooks/stripe</div>
                <br />
                <div># テストイベントを送信</div>
                <div>stripe trigger checkout.session.completed</div>
              </div>
            </div>
          </div>

          {/* トラブルシューティング */}
          <div className="p-6 bg-red-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              トラブルシューティング
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-red-800">1. 署名検証エラー</h3>
                <p className="text-red-700">Webhookシークレットが正しく設定されているか確認してください。</p>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">2. 404エラー</h3>
                <p className="text-red-700">WebhookエンドポイントのURLが正しいか確認してください。</p>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">3. タイムアウト</h3>
                <p className="text-red-700">Webhook処理が5秒以内に完了するようにしてください。</p>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">4. ログの確認</h3>
                <p className="text-red-700">サーバーのログでwebhookの受信状況を確認してください。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 