import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe設定が不完全です" },
        { status: 500 }
      )
    }

    // すべての価格を取得
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    })

    // 価格情報を整形
    const formattedPrices = prices.data.map(price => ({
      id: price.id,
      nickname: price.nickname,
      unit_amount: price.unit_amount,
      currency: price.currency,
      recurring: price.recurring,
      product: price.product as Stripe.Product,
      created: price.created
    }))

    return NextResponse.json({
      prices: formattedPrices,
      count: formattedPrices.length
    })
  } catch (error: any) {
    console.error("Stripe価格取得エラー:", error)
    return NextResponse.json(
      { error: "価格情報の取得に失敗しました", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe設定が不完全です" },
        { status: 500 }
      )
    }

    const { name, amount, currency = "jpy", interval = "month" } = await request.json()

    if (!name || !amount) {
      return NextResponse.json(
        { error: "商品名と価格が必要です" },
        { status: 400 }
      )
    }

    // まず商品を作成
    const product = await stripe.products.create({
      name: name,
      description: `${name}プラン`,
    })

    // 価格を作成
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: currency,
      recurring: {
        interval: interval as "month" | "year" | "week" | "day",
      },
    })

    return NextResponse.json({
      success: true,
      price: {
        id: price.id,
        product_id: product.id,
        name: name,
        amount: amount,
        currency: currency,
        interval: interval
      }
    })
  } catch (error: any) {
    console.error("Stripe価格作成エラー:", error)
    return NextResponse.json(
      { error: "価格の作成に失敗しました", details: error.message },
      { status: 500 }
    )
  }
} 