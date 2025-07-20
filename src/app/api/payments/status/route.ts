import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/lib/prisma"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

// 決済状況を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const email = searchParams.get("email")

    const whereClause: any = {}
    
    if (userId) {
      whereClause.id = userId
    } else if (email) {
      whereClause.email = email
    } else {
      return NextResponse.json(
        { error: "ユーザーIDまたはメールアドレスが必要です" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findFirst({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        isPaid: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        renewalStatus: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    // Stripeから最新のサブスクリプション情報を取得
    let stripeSubscription = null
    if (user.stripeCustomerId) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          limit: 1,
          status: 'active'
        })
        
        if (subscriptions.data.length > 0) {
          stripeSubscription = subscriptions.data[0]
        }
      } catch (error) {
        console.error("Stripe subscription fetch error:", error)
      }
    }

    return NextResponse.json({
      user,
      stripeSubscription,
      lastChecked: new Date().toISOString()
    })
  } catch (error) {
    console.error("Payment status fetch error:", error)
    return NextResponse.json(
      { error: "決済状況の取得に失敗しました" },
      { status: 500 }
    )
  }
}

// 決済状況を更新
export async function PUT(request: NextRequest) {
  try {
    const { userId, isPaid, subscriptionPlan, subscriptionStatus, renewalStatus, syncWithStripe } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが必要です" },
        { status: 400 }
      )
    }

    // まずユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      )
    }

    const updateData: any = {
      isPaid: isPaid !== undefined ? isPaid : undefined,
      subscriptionPlan: subscriptionPlan || undefined,
      subscriptionStatus: subscriptionStatus || undefined,
      renewalStatus: renewalStatus || undefined,
    }

    // Stripeとの同期が要求された場合
    if (syncWithStripe && user.stripeCustomerId) {
      try {
        console.log("Stripeとの同期を開始:", user.email)
        
        // Stripeから最新のサブスクリプション情報を取得
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          limit: 1,
          status: 'active'
        })
        
        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0]
          console.log("Stripeサブスクリプション情報:", {
            id: subscription.id,
            status: subscription.status
          })
          
          updateData.isPaid = subscription.status === "active"
          updateData.subscriptionStatus = subscription.status
          
          console.log("Stripeから取得した情報でDBを更新:", updateData)
        } else {
          console.log("アクティブなサブスクリプションが見つかりません")
          updateData.isPaid = false
          updateData.subscriptionStatus = "canceled"
        }
      } catch (error) {
        console.error("Stripe同期エラー:", error)
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isPaid: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        renewalStatus: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: syncWithStripe ? "Stripeと同期して決済状況が更新されました" : "決済状況が更新されました"
    })
  } catch (error) {
    console.error("Payment status update error:", error)
    return NextResponse.json(
      { error: "決済状況の更新に失敗しました" },
      { status: 500 }
    )
  }
} 