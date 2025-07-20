import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/app/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userEmail } = await request.json()

    console.log("=== 決済完了処理 ===")
    console.log("セッションID:", sessionId)
    console.log("ユーザーメール:", userEmail)
    console.log("=========================")

    if (!sessionId || !userEmail) {
      return NextResponse.json(
        { error: "セッションIDとユーザーメールが必要です" },
        { status: 400 }
      )
    }

    // Stripeからセッション情報を取得
    let session
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId)
      console.log("Stripeセッション情報:", {
        id: session.id,
        status: session.status,
        payment_status: session.payment_status,
        customer: session.customer,
        subscription: session.subscription
      })
    } catch (error) {
      console.error("セッション取得エラー:", error)
      return NextResponse.json(
        { error: "無効なセッションIDです。実際のStripeセッションIDを使用してください。" },
        { status: 400 }
      )
    }

    // セッションが完了しているかチェック
    if (session.status !== "complete") {
      return NextResponse.json(
        { error: "決済が完了していません", status: session.status },
        { status: 400 }
      )
    }

    // ユーザーを検索
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
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
      subscriptionStatus: user.subscriptionStatus
    })

    // サブスクリプション情報を取得
    let subscriptionInfo = null
    if (session.subscription) {
      try {
        subscriptionInfo = await stripe.subscriptions.retrieve(session.subscription as string)
        console.log("サブスクリプション情報:", {
          id: subscriptionInfo.id,
          status: subscriptionInfo.status,
          trial_end: subscriptionInfo.trial_end
        })
      } catch (error) {
        console.error("サブスクリプション取得エラー:", error)
      }
    }

    // データベースを更新
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        isPaid: true,
        subscriptionStatus: subscriptionInfo?.status || "active",
        stripeCustomerId: session.customer as string,
        subscriptionPlan: "BASIC",
      }
    })

    console.log("✅ ユーザー更新完了:", {
      email: updatedUser.email,
      isPaid: updatedUser.isPaid,
      subscriptionStatus: updatedUser.subscriptionStatus,
      stripeCustomerId: updatedUser.stripeCustomerId
    })

    return NextResponse.json({
      success: true,
      message: "決済完了処理が正常に完了しました",
      user: {
        email: updatedUser.email,
        isPaid: updatedUser.isPaid,
        subscriptionStatus: updatedUser.subscriptionStatus
      }
    })

  } catch (error) {
    console.error("❌ 決済完了処理エラー:", error)
    return NextResponse.json(
      { error: "決済完了処理に失敗しました" },
      { status: 500 }
    )
  }
} 