import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, customerEmail, customerId, subscriptionId } = body

    console.log("=== 手動Webhookテスト ===")
    console.log("イベントタイプ:", eventType)
    console.log("顧客メール:", customerEmail)
    console.log("顧客ID:", customerId)
    console.log("サブスクリプションID:", subscriptionId)
    console.log("=========================")

    if (!customerEmail) {
      return NextResponse.json(
        { error: "顧客メールが必要です" },
        { status: 400 }
      )
    }

    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email: customerEmail }
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    console.log("既存ユーザー情報:", {
      id: user.id,
      email: user.email,
      isPaid: user.isPaid,
      subscriptionStatus: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId
    })

    // イベントタイプに応じて処理
    switch (eventType) {
      case "checkout.session.completed":
        const updatedUser = await prisma.user.update({
          where: { email: customerEmail },
          data: {
            isPaid: true,
            subscriptionStatus: "active",
            stripeCustomerId: customerId || user.stripeCustomerId,
            subscriptionPlan: "BASIC",
          }
        })
        console.log("✅ チェックアウト完了 - ユーザー更新完了:", {
          email: updatedUser.email,
          isPaid: updatedUser.isPaid,
          subscriptionStatus: updatedUser.subscriptionStatus,
          stripeCustomerId: updatedUser.stripeCustomerId
        })
        break

      case "customer.subscription.created":
        const subscriptionUser = await prisma.user.update({
          where: { email: customerEmail },
          data: {
            isPaid: true,
            subscriptionStatus: "active",
            stripeCustomerId: customerId || user.stripeCustomerId,
          }
        })
        console.log("✅ サブスクリプション作成 - ユーザー更新完了:", {
          email: subscriptionUser.email,
          isPaid: subscriptionUser.isPaid,
          subscriptionStatus: subscriptionUser.subscriptionStatus
        })
        break

      case "invoice.payment_succeeded":
        const paymentUser = await prisma.user.update({
          where: { email: customerEmail },
          data: {
            isPaid: true,
            subscriptionStatus: "active",
          }
        })
        console.log("✅ 支払い成功 - ユーザー更新完了:", {
          email: paymentUser.email,
          isPaid: paymentUser.isPaid,
          subscriptionStatus: paymentUser.subscriptionStatus
        })
        break

      default:
        return NextResponse.json(
          { error: "未対応のイベントタイプです" },
          { status: 400 }
        )
    }

    return NextResponse.json({ 
      success: true, 
      message: `${eventType}イベントが正常に処理されました`,
      user: {
        email: user.email,
        isPaid: user.isPaid,
        subscriptionStatus: user.subscriptionStatus
      }
    })

  } catch (error) {
    console.error("❌ テストWebhook処理エラー:", error)
    return NextResponse.json(
      { error: "テストWebhook処理に失敗しました" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Webhook test endpoint is working",
    timestamp: new Date().toISOString()
  })
} 