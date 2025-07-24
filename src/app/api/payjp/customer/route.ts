import { NextRequest, NextResponse } from "next/server";
import Payjp from "payjp";

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();
    const PAYJP_SECRET_KEY = process.env.PAYJP_SECRET_KEY;
    if (!PAYJP_SECRET_KEY) {
      return NextResponse.json({ error: "PAYJP_SECRET_KEYが設定されていません" }, { status: 500 });
    }
    if (!email || !token) {
      return NextResponse.json({ error: "emailとtokenは必須です" }, { status: 400 });
    }
    const payjp = Payjp(PAYJP_SECRET_KEY);

    // 既存顧客を全件取得し、email一致を探す
    const customers = await payjp.customers.list({ limit: 100 });
    const found = customers.data.find((c) => c.email === email);
    if (found) {
      return NextResponse.json({ customer: found, existed: true });
    }

    // 顧客新規作成
    const customer = await payjp.customers.create({
      email,
      card: token,
    });
    return NextResponse.json({ customer, existed: false });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'サーバーエラー' }, { status: 500 });
  }
} 