import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import Payjp from "payjp";

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    const eventType = event.type;
    const PAYJP_SECRET_KEY = process.env.PAYJP_SECRET_KEY;
    let customerEmail = null;

    // 1. 直接emailがある場合
    if (event.data?.object?.customer?.email) {
      customerEmail = event.data.object.customer.email;
    }
    // 2. customerがIDの場合
    else if (typeof event.data?.object?.customer === "string" && PAYJP_SECRET_KEY) {
      try {
        const payjp = Payjp(PAYJP_SECRET_KEY);
        const customerObj = await payjp.customers.retrieve(event.data.object.customer);
        customerEmail = customerObj.email;
      } catch (e) {
        console.error("Payjp顧客情報取得エラー", e);
      }
    }
    // 3. object自体にemailがある場合
    else if (event.data?.object?.email) {
      customerEmail = event.data.object.email;
    }

    // デバッグ用ログ
    console.log("Webhook event:", JSON.stringify(event, null, 2));
    console.log("customerEmail:", customerEmail);

    if (!customerEmail) {
      // 400返す代わりにevent内容を返す（デバッグ用）
      return NextResponse.json({ error: "顧客メールが特定できません", event }, { status: 200 });
    }

    // ユーザーを検索
    const user = await prisma.user.findUnique({ where: { email: customerEmail } });
    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません", customerEmail, event }, { status: 200 });
    }

    // イベント種別ごとにDBを更新
    let updateData: any = {};
    let logMsg = "";
    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.resumed":
      case "customer.subscription.updated":
        updateData = {
          isPaid: true,
          subscriptionStatus: event.data?.object?.status || "active",
        };
        logMsg = "サブスクリプション作成/更新/再開";
        break;
      case "customer.subscription.canceled":
      case "customer.subscription.deleted":
        updateData = {
          isPaid: false,
          subscriptionStatus: "canceled",
        };
        logMsg = "サブスクリプション解約/削除";
        break;
      case "invoice.payment_failed":
        updateData = {
          isPaid: false,
          subscriptionStatus: "payment_failed",
        };
        logMsg = "支払い失敗";
        break;
      case "invoice.payment_succeeded":
        updateData = {
          isPaid: true,
          subscriptionStatus: "active",
        };
        logMsg = "支払い成功";
        break;
      default:
        return NextResponse.json({ error: `未対応のイベントタイプ: ${eventType}`, event }, { status: 200 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: customerEmail },
      data: updateData,
    });

    console.log(`✅ [Pay.jp Webhook] ${logMsg}:`, {
      email: updatedUser.email,
      isPaid: updatedUser.isPaid,
      subscriptionStatus: updatedUser.subscriptionStatus,
      eventType,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Pay.jp Webhook処理エラー:", error);
    return NextResponse.json({ error: "Pay.jp Webhook処理に失敗しました" }, { status: 500 });
  }
} 