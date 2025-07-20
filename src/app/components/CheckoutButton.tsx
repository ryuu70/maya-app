"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

interface CheckoutButtonProps {
  priceId: string
  planName: string
  price: string
  className?: string
}

export default function CheckoutButton({ 
  priceId, 
  planName, 
  price, 
  className = "" 
}: CheckoutButtonProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      alert("ログインが必要です")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userEmail: session.user.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "決済セッションの作成に失敗しました")
      }

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.url) {
        throw new Error("決済URLが取得できませんでした")
      }

      // Stripe Checkoutページにリダイレクト
      window.location.href = data.url
    } catch (error: any) {
      console.error("決済エラー詳細:", error)
      alert(`決済エラー: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || !session?.user?.email}
      className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          処理中...
        </div>
      ) : (
        `${planName} - ${price}で始める`
      )}
    </button>
  )
} 