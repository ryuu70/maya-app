"use client"

import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import CheckoutButton from "@/app/components/CheckoutButton"
import Link from "next/link"

function PricingContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const isCanceled = searchParams.get("canceled") === "true"

  const PLANS = [
    {
      name: "星読みベーシック",
      priceId: "price_1RnMJQIS0HO99XqZjKkNZYuJ",
      price: "¥980/月",
      features: [
        "マヤ暦占い",
        "タロット占い"
      ],
      popular: false
    },
    {
      name: "神託プレミアム",
      priceId: "price_1RnMJsIS0HO99XqZbuX54BwO",
      price: "¥2,980/月",
      features: [
        "ベーシックプランの全機能",
        "無制限の占い回数",
        "詳細な運勢分析",
        "優先サポート"
      ],
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-2 sm:py-12 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* キャンセルメッセージ */}
        {isCanceled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-yellow-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold text-yellow-800">
                決済がキャンセルされました
              </h2>
            </div>
            <p className="text-yellow-700 mt-2">
              決済がキャンセルされました。いつでも再度お試しください。
            </p>
          </div>
        )}

        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            料金プラン
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            あなたに最適なプランを選択して、マヤ暦とタロットの神秘的な世界を体験してください
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800 font-semibold">7日間の無料トライアル期間付き！</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              初回登録時は7日間無料でお試しいただけます。期間終了前にキャンセルすれば料金は発生しません。
            </p>
          </div>
        </div>

        {/* プランカード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl p-4 sm:p-8 ${
                plan.popular
                  ? "ring-2 ring-purple-500 transform scale-105"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    人気
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                {/* 価格表示を2段に変更 */}
                <div className="mb-2 flex flex-col items-center justify-center">
                  <div className="text-3xl font-extrabold text-green-600 mb-1 tracking-tight">最初の7日間無料</div>
                  <div className="text-lg font-semibold text-purple-600">その後 {plan.price}</div>
                </div>
                <p className="text-gray-600">月額料金</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                {session?.user ? (
                  <CheckoutButton />
                ) : (
                  <Link
                    href="/login"
                    className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 text-center"
                  >
                    ログインして始める
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* よくある質問 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            よくある質問
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                いつでもキャンセルできますか？
              </h3>
              <p className="text-gray-600">
                はい、いつでもサブスクリプションをキャンセルできます。キャンセル後も期間終了まではサービスをご利用いただけます。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                無料トライアルはありますか？
              </h3>
              <p className="text-gray-600">
                はい！初回登録時は7日間の無料トライアル期間があります。期間終了前にキャンセルすれば料金は発生しません。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                プランの変更は可能ですか？
              </h3>
              <p className="text-gray-600">
                はい、いつでもプランを変更できます。変更は次回の請求日から適用されます。
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                支払い方法は何がありますか？
              </h3>
              <p className="text-gray-600">
                クレジットカード（Visa、Mastercard、American Express）でのお支払いに対応しています。
              </p>
            </div>
          </div>
        </div>

        {/* お問い合わせ */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            ご質問やサポートが必要な場合は、お気軽にお問い合わせください
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            お問い合わせ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-8"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
} 