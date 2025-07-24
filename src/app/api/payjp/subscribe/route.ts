import { NextRequest, NextResponse } from "next/server";
import Payjp from "payjp";

export async function POST(request: NextRequest) {
  const { customerId, planId } = await request.json();
  const PAYJP_SECRET_KEY = process.env.PAYJP_SECRET_KEY;
  if (!PAYJP_SECRET_KEY) {
    return NextResponse.json({ error: "PAYJP_SECRET_KEYが設定されていません" }, { status: 500 });
  }
  if (!customerId || !planId) {
    return NextResponse.json({ error: "customerIdとplanIdは必須です" }, { status: 400 });
  }
  const payjp = Payjp(PAYJP_SECRET_KEY);

  // サブスクリプション作成
  const subscription = await payjp.subscriptions.create({
    customer: customerId,
    plan: planId, // "basic"や"premium"など
  });
  return NextResponse.json({ subscription });
} 