import { NextResponse } from "next/server"

export async function GET() {
  const debugInfo = {
    stripeSecretKey: process.env.STRIPE_SECRET_KEY ? "設定済み" : "未設定",
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY ? "設定済み" : "未設定",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? "設定済み" : "未設定",
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(debugInfo)
} 