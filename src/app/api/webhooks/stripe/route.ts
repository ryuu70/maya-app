import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { prisma } from "@/app/lib/prisma"

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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    console.log("=== Stripe Webhook Received ===")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Signature present:", !!signature)
    console.log("Body length:", body.length)
    console.log("===============================")

    if (!signature) {
      console.error("Webhook signature missing")
      return NextResponse.json(
        { error: "署名が見つかりません" },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    // テストモードの場合は署名検証をスキップ
    const isTestMode = signature === "test_signature" || process.env.NODE_ENV === "development"
    
    if (isTestMode) {
      console.log("Test mode: Skipping signature verification")
      try {
        event = JSON.parse(body) as Stripe.Event
        console.log("Test event parsed successfully")
        console.log("Event type:", event.type)
        console.log("Event ID:", event.id)
      } catch (err) {
        console.error("Test event parsing error:", err)
        return NextResponse.json(
          { error: "テストイベントの解析に失敗しました" },
          { status: 400 }
        )
      }
    } else {
      if (!stripe) {
        console.error("Stripeが初期化されていません")
        return NextResponse.json(
          { error: "Stripe設定が不完全です" },
          { status: 500 }
        )
      }
      
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        console.log("Webhook signature verified successfully")
        console.log("Event type:", event.type)
        console.log("Event ID:", event.id)
      } catch (err) {
        console.error("Webhook署名検証エラー:", err)
        return NextResponse.json(
          { error: "署名検証に失敗しました" },
          { status: 400 }
        )
      }
    }

    // イベントタイプに応じて処理
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        console.log("=== 決済完了イベント ===")
        console.log("セッションID:", session.id)
        console.log("顧客メール:", session.customer_email)
        console.log("顧客ID:", session.customer)
        console.log("支払い状況:", session.payment_status)
        console.log("セッション状況:", session.status)
        console.log("サブスクリプションID:", session.subscription)
        console.log("=========================")
        
        // データベースでユーザーのサブスクリプション状態を更新
        if (session.customer_email) {
          try {
            // まずユーザーが存在するか確認
            const existingUser = await prisma.user.findUnique({
              where: { email: session.customer_email }
            })
            
            if (!existingUser) {
              console.error("ユーザーが見つかりません:", session.customer_email)
              break
            }

            console.log("既存ユーザー情報:", {
              id: existingUser.id,
              email: existingUser.email,
              isPaid: existingUser.isPaid,
              subscriptionStatus: existingUser.subscriptionStatus
            })

            const updatedUser = await prisma.user.update({
              where: { email: session.customer_email },
              data: {
                isPaid: true,
                subscriptionStatus: "active",
                stripeCustomerId: session.customer as string,
                subscriptionPlan: "BASIC", // デフォルトプラン
              }
            })
            console.log("✅ ユーザー更新完了:", {
              email: updatedUser.email,
              isPaid: updatedUser.isPaid,
              subscriptionStatus: updatedUser.subscriptionStatus,
              stripeCustomerId: updatedUser.stripeCustomerId
            })
          } catch (error) {
            console.error("❌ ユーザー更新エラー:", error)
          }
        } else {
          console.error("顧客メールがありません")
        }
        break

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription
        console.log("=== サブスクリプション作成イベント ===")
        console.log("サブスクリプションID:", subscription.id)
        console.log("サブスクリプション状況:", subscription.status)
        console.log("顧客ID:", subscription.customer)
        console.log("トライアル終了日:", subscription.trial_end)
        console.log("=====================================")
        
        // データベースを更新
        try {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: subscription.customer as string }
          })
          
          if (user) {
            console.log("ユーザー情報:", {
              id: user.id,
              email: user.email,
              isPaid: user.isPaid,
              subscriptionStatus: user.subscriptionStatus
            })

            // トライアル期間中は課金状態として扱う
            const isPaid = subscription.status === "active" || subscription.status === "trialing"
            
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                isPaid: isPaid,
                subscriptionStatus: subscription.status,
              }
            })
            console.log("✅ サブスクリプション作成 - ユーザー更新完了:", {
              email: updatedUser.email,
              isPaid: updatedUser.isPaid,
              subscriptionStatus: updatedUser.subscriptionStatus
            })
          } else {
            console.log("⚠️ stripeCustomerIdに一致するユーザーが見つかりません:", subscription.customer)
          }
        } catch (error) {
          console.error("❌ サブスクリプション作成 - ユーザー更新エラー:", error)
        }
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log("=== サブスクリプション更新イベント ===")
        console.log("サブスクリプションID:", updatedSubscription.id)
        console.log("新しい状況:", updatedSubscription.status)
        console.log("顧客ID:", updatedSubscription.customer)
        console.log("=====================================")
        
        // データベースを更新
        try {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: updatedSubscription.customer as string }
          })
          
          if (user) {
            console.log("ユーザー情報:", {
              id: user.id,
              email: user.email,
              isPaid: user.isPaid,
              subscriptionStatus: user.subscriptionStatus
            })

            // トライアル期間中は課金状態として扱う
            const isPaid = updatedSubscription.status === "active" || updatedSubscription.status === "trialing"
            
            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                isPaid: isPaid,
                subscriptionStatus: updatedSubscription.status,
              }
            })
            console.log("✅ サブスクリプション更新 - ユーザー更新完了:", {
              email: updatedUser.email,
              isPaid: updatedUser.isPaid,
              subscriptionStatus: updatedUser.subscriptionStatus
            })
          } else {
            console.log("⚠️ stripeCustomerIdに一致するユーザーが見つかりません:", updatedSubscription.customer)
          }
        } catch (error) {
          console.error("❌ サブスクリプション更新 - ユーザー更新エラー:", error)
        }
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log("=== サブスクリプション削除イベント ===")
        console.log("サブスクリプションID:", deletedSubscription.id)
        console.log("削除状況:", deletedSubscription.status)
        console.log("顧客ID:", deletedSubscription.customer)
        console.log("=====================================")
        
        // データベースを更新
        try {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: deletedSubscription.customer as string }
          })
          
          if (user) {
            console.log("ユーザー情報:", {
              id: user.id,
              email: user.email,
              isPaid: user.isPaid,
              subscriptionStatus: user.subscriptionStatus
            })

            const updatedUser = await prisma.user.update({
              where: { id: user.id },
              data: {
                isPaid: false,
                subscriptionStatus: "canceled",
              }
            })
            console.log("✅ サブスクリプション削除 - ユーザー更新完了:", {
              email: updatedUser.email,
              isPaid: updatedUser.isPaid,
              subscriptionStatus: updatedUser.subscriptionStatus
            })
          } else {
            console.log("⚠️ stripeCustomerIdに一致するユーザーが見つかりません:", deletedSubscription.customer)
          }
        } catch (error) {
          console.error("❌ サブスクリプション削除 - ユーザー更新エラー:", error)
        }
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice
        console.log("=== 支払い成功イベント ===")
        console.log("インボイスID:", invoice.id)
        console.log("顧客ID:", invoice.customer)
        console.log("支払い状況:", invoice.status)
        console.log("=========================")
        
        // 支払い成功時もユーザー状態を更新
        if (invoice.customer) {
          try {
            const user = await prisma.user.findFirst({
              where: { stripeCustomerId: invoice.customer as string }
            })
            
            if (user) {
              const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                  isPaid: true,
                  subscriptionStatus: "active",
                }
              })
              console.log("✅ 支払い成功 - ユーザー更新完了:", updatedUser.email)
            }
          } catch (error) {
            console.error("❌ 支払い成功 - ユーザー更新エラー:", error)
          }
        }
        break

      default:
        console.log(`未処理のイベントタイプ: ${event.type}`)
        console.log("イベントデータ:", JSON.stringify(event.data, null, 2))
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("❌ Webhook処理エラー:", error)
    return NextResponse.json(
      { error: "Webhook処理に失敗しました" },
      { status: 500 }
    )
  }
} 