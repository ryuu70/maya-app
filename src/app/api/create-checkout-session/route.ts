import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Stripe初期化のエラーハンドリング
let stripe: Stripe | null = null

try {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEYが設定されていません")
  } else {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    })
  }
} catch (error) {
  console.error("Stripe初期化エラー:", error)
}

export async function POST(request: NextRequest) {
  try {
    // Stripe初期化の確認
    if (!stripe) {
      console.error("Stripeが初期化されていません")
      return NextResponse.json(
        { error: "Stripe設定が不完全です" },
        { status: 500 }
      )
    }

    const { priceId, userEmail } = await request.json()
    
    console.log("受信データ:", { priceId, userEmail })
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "ユーザー情報が必要です" },
        { status: 400 }
      )
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "価格IDが必要です" },
        { status: 400 }
      )
    }

    const origin = request.headers.get("origin") || "http://localhost:3000"
    console.log("Origin:", origin)

    // Stripe Checkoutセッションを作成（無料トライアル期間付き）
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userEmail: userEmail,
      },
      subscription_data: {
        metadata: {
          userEmail: userEmail,
        },
        // 無料トライアル期間を7日間に変更
        trial_period_days: 7,
      },
    })

    console.log("Checkout session created:", checkoutSession.id)
    console.log("Trial period days: 30")
    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("Stripe Checkout エラー詳細:", {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    })
    
    // より具体的なエラーメッセージを返す
    let errorMessage = "決済セッションの作成に失敗しました"
    if (error.type === "StripeInvalidRequestError") {
      if (error.code === "resource_missing") {
        errorMessage = "無効な価格IDです。Stripeダッシュボードで価格を確認してください。"
      } else if (error.code === "parameter_invalid_integer") {
        errorMessage = "価格設定に問題があります。"
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    )
  }
} 