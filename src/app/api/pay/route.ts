import { NextRequest, NextResponse } from "next/server";
import Payjp from "payjp";

export async function POST(request: NextRequest) {
  const { token, plan } = await request.json();
  if (!token) {
    return NextResponse.json({ success: false, message: "トークンがありません" }, { status: 400 });
  }

  const PAYJP_SECRET_KEY = process.env.PAYJP_SECRET_KEY;
  if (!PAYJP_SECRET_KEY) {
    return NextResponse.json({ success: false, message: "PAYJP_SECRET_KEYが設定されていません" }, { status: 500 });
  }

  // プランによって金額を分岐
  let amount = 1000;
  if (plan === "basic") amount = 980;
  if (plan === "premium") amount = 2980;

  try {
    const payjp = Payjp(PAYJP_SECRET_KEY);
    const charge = await payjp.charges.create({
      amount,
      card: token,
      currency: "jpy",
    });
    return NextResponse.json({ success: true, message: "決済完了", charge });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || "決済処理でエラーが発生しました" }, { status: 500 });
  }
} 